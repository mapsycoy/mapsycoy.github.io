export type MediaItem = {
  type: "image" | "link";
  src?: string;
  href?: string;
  alt?: string;
  label?: string;
};

export type ExperienceItem = {
  role: string;
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

export const profile = {
  name: "Kim Junyeop",
  location: "Republic of Korea / Seoul",
  photo: "/cv/profile.jpg"
};

export const education: EducationItem[] = [
  {
    institution: "Kookmin University",
    degree: "BFA, Entertainment Design · Minor in Future Tech Conv. Design",
    period: "Mar 2019 - Feb 2026",
    description: [
      "Merit-based Admission(special talent track)",
    ],
  },
  {
    institution: "",
    degree: "Incoming Graduate Student focused on HCI",
    period: "Sep 2026 -",
    description: [
      "",
    ],
  }
];

export const artsGiftedEducationCertificate = {
  title: "Certificate in Arts Gifted Education",
  logos: [
    { src: "/cv/logos/SAC.svg", alt: "Certificate logo 1" },
    { src: "/cv/logos/snue.png", alt: "Certificate logo 2" },
    { src: "/cv/logos/SEN.svg", alt: "Certificate logo 3" },
  ] satisfies CertificateLogoItem[],
};

export const experiences: ExperienceItem[] = [
  {
    role: "Concept Artist · Illustrator",
    organization: "NEXON KOREA",
    employmentType: "Internship",
    period: "Dec 2025 - May 2026",
    logo: "/cv/logos/nexon.png"
  },
  {
    role: "AI Illustrator",
    organization: "Enuma Inc.",
    employmentType: "Contract",
    period: "Jul 2025 - Sep 2025",
    logo: "/cv/logos/enuma.png"
  },
  {
    role: "CDO",
    organization: "unipuskr",
    period: "Feb 2023 - Dec 2023",
    logo: "/cv/logos/unipuskr.png"
  },
  {
    role: "Animator · Illustrator",
    organization: "Studio JBBJ",
    employmentType: "Freelance",
    period: "Oct 2021 - Oct 2022",
    logo: "/cv/logos/studio-jbbj.png"
  },
  {
    role: "Seoul National University of Education",
    organization: "Gifted in Art Center",
    employmentType: "Part-time",
    period: "1 yr 1 mo",
    logo: "/cv/logos/snue.png",
    subEntries: [
      {
        title: "Administrative Assistant",
        period: "Sep 2021 - Feb 2022",
      },
      {
        title: "Teaching Assistant",
        period: "May 2019 - Dec 2019 / Mar 2022 - Sep 2022",
      }
    ]
  },
];

export const projects: ProjectItem[] = [
  {
    title: "Atelier Gwanghwa: An Invitation to the Square",
    period: "2023 / 2024",
    description: [
      "Selected Motion Designer for 1st & 2nd media facade project"
    ],
     media: [
    {
      type: "image",
      src: "/cv/projects/atelier2024.jpg",
      href: "https://www.youtube.com/watch?v=JXRhq4vxzGY",
      label: "Open link"
    },
    {
      type: "image",
      src: "/cv/projects/atelier2023.jpg",
      href: "https://webzine.kookmin.ac.kr/webzine.php?syear=2023&svolume=4&mcode=31",
      label: "Open link"
    }
  ]
  },
  {
    title: "RED Flight",
    period: "Apr 2024 - Dec 2024",
    description: [
      "Aim Intelligence In-house Project(External Contributor)"
    ],
     media: [
    {
      type: "image",
      src: "/cv/projects/redflight.jpg",
      href: "https://luma.com/ivs-demoday",
      label: "Open link"
    }
  ]
  },
  {
    title: "Direp",
    period: "Sep 2025 - Present",
    description: [
      "On-going project for the reptile industry"
    ]
  }
];
