import { getCollection, type CollectionEntry } from "astro:content";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export type WorkItem = CollectionEntry<"works">;

type WorksOrder = {
  works?: { work?: string }[];
};

const getWorkOrder = () => {
  try {
    const orderPath = fileURLToPath(new URL("./works-order.json", import.meta.url));
    const worksOrder = JSON.parse(readFileSync(orderPath, "utf-8")) as WorksOrder;

    return new Map(
      (worksOrder.works ?? [])
        .map((item) => item.work)
        .filter((work): work is string => Boolean(work))
        .map((work, index) => [work, index])
    );
  } catch {
    return new Map<string, number>();
  }
};

const workOrder = getWorkOrder();

export const sortWorks = (works: WorkItem[]) =>
  [...works].sort((a, b) => {
    const orderA = workOrder.get(a.id) ?? Number.POSITIVE_INFINITY;
    const orderB = workOrder.get(b.id) ?? Number.POSITIVE_INFINITY;

    return orderA - orderB || b.data.year.localeCompare(a.data.year) || a.id.localeCompare(b.id);
  });

export const getWorks = async ({ includeDrafts = false } = {}) => {
  const works = await getCollection("works");
  const visibleWorks = includeDrafts ? works : works.filter((work) => work.data.status === "published");

  return sortWorks(visibleWorks);
};
