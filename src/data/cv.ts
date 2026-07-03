import cvData from "./cv.json";
import type { LocalizedText } from "../utils/i18n";

export type LocalizedTextLine = LocalizedText | { line?: LocalizedText };

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
export const projects = cvData.projects as ProjectItem[];
