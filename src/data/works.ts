import { getCollection, type CollectionEntry } from "astro:content";
import worksOrder from "./works-order.json";

export type WorkItem = CollectionEntry<"works">;

type WorksOrder = {
  works?: { work?: string }[];
  collaborative?: { work?: string }[];
  independent?: { work?: string }[];
};

const getOrderedWorks = (items?: { work?: string }[]) =>
  (items ?? []).map((item) => item.work).filter((work): work is string => Boolean(work));

const getWorkOrder = () => {
  const order = worksOrder as WorksOrder;
  const sectionOrder = [
    ...getOrderedWorks(order.collaborative),
    ...getOrderedWorks(order.independent),
  ];
  const orderedWorks = sectionOrder.length > 0 ? sectionOrder : getOrderedWorks(order.works);

  return new Map(orderedWorks.map((work, index) => [work, index]));
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
