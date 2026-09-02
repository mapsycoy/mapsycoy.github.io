import cvData from "./cv.json";
import type { LocalizedText } from "../utils/i18n";

export type LocalizedTextLine = (LocalizedText | { line?: LocalizedText }) & { award?: boolean };

export type MediaItem = {
  type: "image" | "link";
  src?: string;
  href?: string;
  alt?: LocalizedText;
  label?: LocalizedText;
};

export type ExperienceItem = {
  role: LocalizedText;
  team?: LocalizedText;
  organization: LocalizedText;
  employmentType?: LocalizedText;
  period: LocalizedText;
  duration?: LocalizedText;
  description?: LocalizedTextLine[];
  logo?: string;
  logoDark?: string;
  media?: MediaItem[];
  subEntries?: {
    title: LocalizedText;
    period: LocalizedText;
    duration?: LocalizedText;
    description?: LocalizedTextLine[];
  }[];
};

export type EducationItem = {
  institution: LocalizedText;
  degree: LocalizedText;
  minor?: LocalizedText;
  period: LocalizedText;
  description?: LocalizedTextLine[];
  logo?: string;
  media?: MediaItem[];
};

export type CertificationItem = {
  title: LocalizedText;
  issuer: string;
  issued?: string;
  credentialId?: string;
  logo?: string;
};

export type CertificateLogoItem = {
  src: string;
  alt: LocalizedText;
};

export type CertificateCompletionItem = {
  institution: LocalizedText;
  period?: LocalizedText;
  logo?: string;
  alt?: LocalizedText;
};

export type ProjectItem = {
  title: LocalizedText;
  period: LocalizedText;
  description?: LocalizedTextLine[];
  media?: MediaItem[];
  links?: {
    label: LocalizedText;
    href: string;
  }[];
};

export type PublicationItem = {
  title: LocalizedText;
  authors: LocalizedText[];
  year?: string;
  venue?: LocalizedText;
  status?: LocalizedText;
  description?: LocalizedTextLine[];
  links?: {
    label: LocalizedText;
    href: string;
  }[];
};

export type SkillGroup = {
  category: LocalizedText;
  items: LocalizedText[];
};

export type ProfileLink = {
  label: LocalizedText;
  href: string;
};

export const profile = cvData.profile;
export const education = cvData.education as EducationItem[];
export const artsGiftedEducationCertificate = cvData.artsGiftedEducationCertificate as {
  title: LocalizedText;
  logos: CertificateLogoItem[];
  items?: CertificateCompletionItem[];
};
export const experiences = cvData.experiences as ExperienceItem[];
const projectMonth = new Map([
  ["Jan", 1], ["Feb", 2], ["Mar", 3], ["Apr", 4], ["May", 5], ["Jun", 6],
  ["Jul", 7], ["Aug", 8], ["Sep", 9], ["Oct", 10], ["Nov", 11], ["Dec", 12],
]);
const getProjectRecency = (project: ProjectItem) => {
  const period = project.period.en;
  if (/present/i.test(period)) return Number.POSITIVE_INFINITY;
  const dates = [...period.matchAll(/(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+)?(\d{4})/g)]
    .map((match) => Number(match[2]) * 12 + (projectMonth.get(match[1]) ?? 0));
  return dates.length ? Math.max(...dates) : 0;
};
export const projects = [...(cvData.projects as ProjectItem[])].sort((a, b) => getProjectRecency(b) - getProjectRecency(a));
export const publications = (cvData.publications ?? []) as PublicationItem[];
