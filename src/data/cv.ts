import cvData from "./cv.json";
import type { LocalizedText } from "../utils/i18n";

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
  period: string;
  duration?: LocalizedText;
  description?: LocalizedText[];
  logo?: string;
  media?: MediaItem[];
  subEntries?: {
    title: LocalizedText;
    period: string;
    duration?: LocalizedText;
    description?: LocalizedText[];
  }[];
};

export type EducationItem = {
  institution: LocalizedText;
  degree: LocalizedText;
  period: string;
  description?: LocalizedText[];
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
  alt: string;
};

export type ProjectItem = {
  title: LocalizedText;
  period: string;
  description?: LocalizedText[];
  media?: MediaItem[];
  links?: {
    label: string;
    href: string;
  }[];
};

export type SkillGroup = {
  category: LocalizedText;
  items: LocalizedText[];
};

export type ProfileLink = {
  label: string;
  href: string;
};

export const profile = cvData.profile;
export const education = cvData.education as EducationItem[];
export const artsGiftedEducationCertificate = cvData.artsGiftedEducationCertificate as {
  title: LocalizedText;
  logos: CertificateLogoItem[];
};
export const experiences = cvData.experiences as ExperienceItem[];
export const projects = cvData.projects as ProjectItem[];
