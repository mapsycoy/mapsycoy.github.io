// Run after `npm run build`: node --test scripts/series-order.test.mjs
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { parse } from 'parse5';
import yaml from 'js-yaml';

const root = new URL('../', import.meta.url);
const expected = [
  'blog:1', 'blog:2', 'blog:3', 'blog:4', 'blog:5', 'blog:7',
  'blog:8', 'blog:9', 'blog:10', 'note:p4c-and-art-gifted-education',
  'note:child-ai-interaction-research-ideas', 'blog:16',
];
const entries = [];
for (const [kind, directory] of [['blog', 'blog'], ['note', 'notes']]) {
  for (const filename of await readdir(new URL(`src/content/${directory}/`, root))) {
    if (!filename.endsWith('.md') || filename.startsWith('_')) continue;
    const source = await readFile(new URL(`src/content/${directory}/${filename}`, root), 'utf8');
    const data = yaml.load(source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '');
    if (!data || data.status === 'draft') continue;
    entries.push({ kind, id: `${kind}:${filename.slice(0, -3)}`, data });
  }
}
const child = entries.filter(e => e.data.series === 'child-ai' && e.data.seriesOrder !== undefined)
  .sort((a, b) => a.data.seriesOrder - b.data.seriesOrder);
const attribute = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const hasClass = (node, name) => attribute(node, 'class')?.split(/\s+/).includes(name);
const find = (node, predicate) => [ ...(predicate(node) ? [node] : []),
  ...(node.childNodes ?? []).flatMap(child => find(child, predicate)) ];
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const documentAt = async route => parse(await readFile(new URL(`dist${route}index.html`, root), 'utf8'));
const routeFor = (id, prefix) => `${prefix}/blog/${id.replace('note:', 'notes/').replace('blog:', '')}/`;
const pad = value => String(value).padStart(2, '0');

test('child-ai has the intended 12 entries with consecutive editorial positions', () => {
  assert.deepEqual(child.map(e => e.id), expected);
  assert.deepEqual(child.map(e => e.data.seriesOrder), expected.map((_, i) => i + 1));
  const p4c = child[9], ideas = child[10], creative = child[11];
  assert.ok(p4c.data.date < ideas.data.date && ideas.data.date < creative.data.publishedAt);
  assert.equal(entries.filter(e => e.id === 'note:child-ai-interaction-research-ideas').length, 1);
});

for (const [lang, prefix] of [['en', ''], ['ko', '/ko']]) {
  test(`${lang}: card order, detail counters, previous/next links and search metadata agree`, async () => {
    const hub = await documentAt(`${prefix}/blog/`);
    const panel = find(hub, n => attribute(n, 'id') === 'series-panel-child-ai')[0];
    const list = find(panel, n => hasClass(n, 'series-drawer-list'))[0];
    assert.deepEqual(find(list, n => n.tagName === 'a').map(n => attribute(n, 'href')), expected.map(id => routeFor(id, prefix)));
    assert.deepEqual(find(list, n => hasClass(n, 'series-drawer-entry-number')).map(text), expected.map((_, i) => pad(i + 1)));
    assert.deepEqual(find(list, n => hasClass(n, 'series-drawer-entry-title')).map(text), child.map(e => e.kind === 'blog' ? e.data.title[lang] : lang === 'en' ? e.data.titleEn : e.data.title));
    for (const [index, id] of expected.entries()) {
      const page = await documentAt(routeFor(id, prefix));
      const context = find(page, n => hasClass(n, 'blog-series-context'))[0];
      assert.ok(text(context).trim().endsWith(`${index + 1}/12`), id);
      const nav = find(page, n => hasClass(n, 'blog-series-navigation'))[0];
      const adjacent = [expected[index - 1], expected[index + 1]].filter(Boolean).map(id => routeFor(id, prefix));
      assert.deepEqual(find(nav, n => n.tagName === 'a').map(n => attribute(n, 'href')), adjacent, id);
      assert.equal(find(page, n => attribute(n, 'data-pagefind-meta') === `series:Series 01 · ${index + 1}/12`).length, 1, id);
    }
    const other = find(hub, n => attribute(n, 'id') === 'series-panel-communicating-intent')[0];
    assert.deepEqual(find(other, n => n.tagName === 'a').map(n => attribute(n, 'href')), ['17', '20'].map(slug => `${prefix}/blog/${slug}/`));
  });

  test(`${lang}: all tag pages use the same mixed series positions`, async () => {
    const seen = new Set();
    const tagRoot = new URL(`dist${prefix}/blog/tag/`, root);
    const htmlFiles = (await readdir(tagRoot, { recursive: true })).filter(file => file.endsWith('index.html'));
    for (const file of htmlFiles) {
      const page = parse(await readFile(new URL(file.replaceAll('\\', '/'), tagRoot), 'utf8'));
      for (const link of find(page, n => hasClass(n, 'blog-entry-link'))) {
        const href = attribute(link, 'href');
        const index = expected.findIndex(id => routeFor(id, prefix) === href);
        if (index < 0) continue;
        seen.add(expected[index]);
        const meta = find(link, n => hasClass(n, 'blog-entry-series-meta'))[0];
        assert.equal(text(meta).trim(), `Series 01 · ${pad(index + 1)}/12`, href);
      }
    }
    assert.deepEqual([...seen].sort(), expected.filter(id => id.startsWith('blog:')).sort());
  });
}
