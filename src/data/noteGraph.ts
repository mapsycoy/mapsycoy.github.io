import type { NoteEntry } from "./notes";
import { getNoteTitle } from "./notes";
import { createNoteResolver, extractWikilinks } from "../utils/noteGarden.mjs";
import { withLanguage } from "../utils/i18n";
import graphLabelCache from "./note-graph-labels.json";

export type NoteGraphNode = {
  id: string;
  title: string;
  graphLabel: string;
  slug: string;
  url: string;
  date?: string;
  updated?: string;
  tags?: string[];
  linkCount: number;
  series?: string;
  kind: "hub" | "core" | "bridge" | "satellite" | "standalone";
  clusterId?: string;
  importanceScore: number;
};

export type NoteGraphEdge = { source: string; target: string; kind: "wikilink" | "series" | "both" };
export type NoteGraphData = {
  nodes: NoteGraphNode[];
  edges: NoteGraphEdge[];
  outgoing: Record<string, string[]>;
  backlinks: Record<string, string[]>;
  unresolved: Array<{ source: string; target: string }>;
};

const noteTitleHash = (title: string, titleEn = "") => {
  let hash = 2166136261;
  for (const character of `${title}\u0000${titleEn}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(36);
};

export const createNoteGraph = (notes: NoteEntry[], lang: "ko" | "en" = "ko"): NoteGraphData => {
  const publicNotes = notes.filter((note) => note.data.status !== "draft");
  const records = publicNotes.map((note) => ({
    id: note.id,
    filename: (note as NoteEntry & { filePath?: string }).filePath?.replace(/\\/g, "/").replace(/^.*\/content\/notes\//, "").replace(/\.md$/i, ""),
    title: note.data.title ?? getNoteTitle(note, "ko"),
    status: note.data.status,
    body: note.body,
  }));
  const resolve = createNoteResolver(records);
  const directed = new Set<string>();
  const visual = new Map<string, Set<"wikilink" | "series">>();
  const unresolved: NoteGraphData["unresolved"] = [];
  const outgoing: Record<string, string[]> = Object.fromEntries(publicNotes.map((note) => [note.id, []]));
  const backlinks: Record<string, string[]> = Object.fromEntries(publicNotes.map((note) => [note.id, []]));

  for (const note of publicNotes) {
    for (const link of extractWikilinks(note.body)) {
      const target = resolve(link.target);
      if (!target) {
        if (!unresolved.some((item) => item.source === note.id && item.target === link.target)) {
          unresolved.push({ source: note.id, target: link.target });
        }
        continue;
      }
      if (target.id === note.id) continue;
      const directedKey = `${note.id}\u0000${target.id}`;
      if (directed.has(directedKey)) continue;
      directed.add(directedKey);
      outgoing[note.id].push(target.id);
      backlinks[target.id].push(note.id);
      const visualKey = [note.id, target.id].sort().join("\u0000");
      const kinds = visual.get(visualKey) ?? new Set();
      kinds.add("wikilink");
      visual.set(visualKey, kinds);
    }
  }

  const hubsBySeries = new Map<string, NoteEntry>();
  for (const note of publicNotes) {
    if (note.data.series && note.data.seriesHub && !hubsBySeries.has(note.data.series)) hubsBySeries.set(note.data.series, note);
  }
  for (const note of publicNotes) {
    if (!note.data.series || note.data.seriesHub) continue;
    const hub = hubsBySeries.get(note.data.series);
    if (!hub) continue;
    const visualKey = [hub.id, note.id].sort().join("\u0000");
    const kinds = visual.get(visualKey) ?? new Set();
    kinds.add("series");
    visual.set(visualKey, kinds);
  }

  const degree = Object.fromEntries(publicNotes.map((note) => [note.id, new Set<string>()]));
  const edges = [...visual].map(([key, kinds]) => {
    const [source, target] = key.split("\u0000");
    degree[source].add(target);
    degree[target].add(source);
    return { source, target, kind: kinds.size > 1 ? "both" as const : [...kinds][0] };
  });
  const conceptualNeighbors = new Map(publicNotes.map((note) => [note.id, new Set<string>()]));
  for (const [key, kinds] of visual) {
    if (!kinds.has("wikilink")) continue;
    const [source, target] = key.split("\u0000");
    conceptualNeighbors.get(source)?.add(target);
    conceptualNeighbors.get(target)?.add(source);
  }
  const autoKind = new Map<string, NoteGraphNode["kind"]>();
  const autoCluster = new Map<string, string>();
  const importance = new Map<string, number>();
  const jaccard = (left: Set<string>, right: Set<string>) => {
    const union = new Set([...left, ...right]);
    if (!union.size) return 0;
    return [...left].filter((value) => right.has(value)).length / union.size;
  };

  for (const seriesId of new Set(publicNotes.map((note) => note.data.series).filter(Boolean) as string[])) {
    const seriesNotes = publicNotes.filter((note) => note.data.series === seriesId);
    const hubs = seriesNotes.filter((note) => note.data.seriesHub);
    hubs.forEach((note) => { autoKind.set(note.id, "hub"); importance.set(note.id, conceptualNeighbors.get(note.id)?.size ?? 0); });
    const members = seriesNotes.filter((note) => !note.data.seriesHub);
    if (!members.length) continue;
    const memberIds = new Set(members.map((note) => note.id));
    const neighborsInSeries = (id: string) => new Set([...(conceptualNeighbors.get(id) ?? [])].filter((neighbor) => memberIds.has(neighbor)));
    members.forEach((note) => importance.set(note.id, neighborsInSeries(note.id).size));

    const anchorTarget = Math.max(1, Math.min(4, Math.round(Math.sqrt(members.length / 2))));
    const anchors = members.filter((note) => note.data.seriesOrder !== undefined).sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0)).slice(0, anchorTarget);
    while (anchors.length < anchorTarget) {
      const candidates = members.filter((note) => !anchors.some((anchor) => anchor.id === note.id));
      if (!candidates.length) break;
      candidates.sort((a, b) => {
        const diversity = (note: NoteEntry) => anchors.length ? 1 - Math.max(...anchors.map((anchor) => jaccard(neighborsInSeries(note.id), neighborsInSeries(anchor.id)))) : 1;
        const score = (note: NoteEntry) => (neighborsInSeries(note.id).size + 1) * (0.55 + diversity(note));
        return score(b) - score(a) || a.id.localeCompare(b.id);
      });
      anchors.push(candidates[0]);
    }
    anchors.forEach((anchor) => { autoKind.set(anchor.id, "core"); autoCluster.set(anchor.id, anchor.id); });

    for (const note of members.filter((item) => !anchors.some((anchor) => anchor.id === item.id))) {
      const neighbors = neighborsInSeries(note.id);
      const ranked = anchors.map((anchor) => ({
        id: anchor.id,
        score: (neighbors.has(anchor.id) ? 3 : 0) + jaccard(neighbors, neighborsInSeries(anchor.id)) * 2 + [...neighbors].filter((neighbor) => neighborsInSeries(anchor.id).has(neighbor)).length * 0.35,
      })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
      autoCluster.set(note.id, ranked[0]?.id ?? anchors[0]?.id ?? note.id);
    }

    const groupFor = (id: string) => autoCluster.get(id) ?? id;
    for (const note of members.filter((item) => !anchors.some((anchor) => anchor.id === item.id))) {
      const groupCounts = new Map<string, number>();
      for (const neighbor of neighborsInSeries(note.id)) {
        const group = groupFor(neighbor);
        groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1);
      }
      const counts = [...groupCounts.values()].sort((a, b) => b - a);
      const isBridge = counts.length > 1 && counts[1] >= 2 && counts[1] >= counts[0] * 0.55;
      autoKind.set(note.id, isBridge ? "bridge" : "satellite");
    }
  }
  for (const note of publicNotes.filter((item) => !item.data.series)) {
    autoKind.set(note.id, "standalone");
    importance.set(note.id, conceptualNeighbors.get(note.id)?.size ?? 0);
  }
  const nodes = publicNotes.map((note) => {
    const titleKo = getNoteTitle(note, "ko");
    const titleEn = getNoteTitle(note, "en");
    const cached = (graphLabelCache.entries as Record<string, { sourceHash: string; ko: string; en: string }>)[note.id];
    const graphLabel = cached?.sourceHash === noteTitleHash(titleKo, titleEn)
      ? (lang === "ko" ? cached.ko : cached.en)
      : getNoteTitle(note, lang);
    return ({
    id: note.id,
    title: getNoteTitle(note, lang),
    graphLabel,
    slug: note.id,
    url: withLanguage(lang, `/blog/notes/${note.id.split("/").map(encodeURIComponent).join("/")}/`),
    date: note.data.date?.toISOString(),
    updated: note.data.updated?.toISOString(),
    tags: note.data.tags,
    linkCount: degree[note.id].size,
    series: note.data.series,
    kind: autoKind.get(note.id) ?? "standalone",
    clusterId: autoCluster.get(note.id),
    importanceScore: importance.get(note.id) ?? 0,
    });
  });

  return { nodes, edges, outgoing, backlinks, unresolved };
};
