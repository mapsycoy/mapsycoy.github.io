import cvData from "./cv.json";

export type MediaItem = {
  type: "image" | "link";
  src?: string;
  href?: string;
  alt?: string;
  label?: string;
};

export type ExperienceItem = {
  role: string;
  team?: string;
  organization: string;
  employmentType?: string;
  period: string;
  duration?: string;
  description?: string[];
  logo?: string;
  media?: MediaItem[];
  subEntries?: {
    title: string;
    period: string;
    duration?: string;
    description?: string[];
  }[];
};

export type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  description?: string[];
  logo?: string;
  media?: MediaItem[];
};

export type CertificationItem = {
  title: string;
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
  title: string;
  period: string;
  description?: string[];
  media?: MediaItem[];
  links?: {
    label: string;
    href: string;
  }[];
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type ProfileLink = {
  label: string;
  href: string;
};

export const profile = cvData.profile;
export const education = cvData.education as EducationItem[];
export const artsGiftedEducationCertificate = cvData.artsGiftedEducationCertificate as {
  title: string;
  logos: CertificateLogoItem[];
};
export const experiences = cvData.experiences as ExperienceItem[];
export const projects = cvData.projects as ProjectItem[];
