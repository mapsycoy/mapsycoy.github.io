import topicData from "./topics.json";
import { localize, type Language, type LocalizedText } from "../utils/i18n";

type TopicMetadata = {
  number: number;
  label: LocalizedText;
  description: LocalizedText;
};

type TopicData = Record<string, TopicMetadata>;

export type TopicId = keyof typeof topicData;

export const topics = topicData as TopicData & Record<TopicId, TopicMetadata>;

/** Registry keys, ordered by the editorial number field. */
export const topicIds = (Object.keys(topicData) as TopicId[]).sort(
  (a, b) => topics[a].number - topics[b].number
);

export const isTopicId = (value: string | undefined | null): value is TopicId =>
  typeof value === "string" && value in topicData;

export const getTopicMetadata = (value: string | undefined | null) =>
  isTopicId(value) ? topics[value] : undefined;

export const getTopicLabel = (value: string | undefined | null, lang: Language) => {
  const metadata = getTopicMetadata(value);
  return metadata ? localize(metadata.label, lang) : value ?? "";
};
