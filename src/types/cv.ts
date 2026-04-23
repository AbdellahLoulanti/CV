export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  photo: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  current: boolean;
}

export interface BulletItem {
  id: string;
  text: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  bullets: BulletItem[];
  technologies: string[];
  current: boolean;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  bullets: BulletItem[];
  technologies: string[];
  link: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface CVSection {
  id: string;
  type: SectionType;
  label: string;
  visible: boolean;
}

export type SectionType =
  | 'profile'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'languages'
  | 'certifications';

export interface CVData {
  personalInfo: PersonalInfo;
  profile: string;
  education: Education[];
  experience: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  languages: Language[];
  certifications: Certification[];
  sections: CVSection[];
}

export type TemplateType = 'classic' | 'modern' | 'minimal';

export type ColorTheme = 'slate' | 'blue' | 'purple' | 'green' | 'red' | 'orange' | 'teal';

export interface ThemeConfig {
  primary: string;
  accent: string;
  heading: string;
  border: string;
  badge: string;
  badgeText: string;
  gradient: string;
}
