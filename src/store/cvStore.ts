import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CVData, TemplateType, ColorTheme, CVSection, Experience, Education, SkillCategory, Project, Language, Certification, BulletItem } from '../types/cv';
import { defaultCVData } from '../data/defaultData';
import { v4 as uuidv4 } from 'uuid';

type ViewMode = 'split' | 'edit' | 'preview';
type ActiveEditor = 'personal' | 'profile' | 'education' | 'experience' | 'skills' | 'projects' | 'languages' | 'certifications' | 'sections';

interface CVStore {
  cvData: CVData;
  template: TemplateType;
  colorTheme: ColorTheme;
  viewMode: ViewMode;
  activeEditor: ActiveEditor;
  zoom: number;

  // Personal & Profile
  updatePersonalInfo: (field: string, value: string) => void;
  updateProfile: (value: string) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string | boolean) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (items: Education[]) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string | boolean) => void;
  addExperienceBullet: (expId: string) => void;
  updateExperienceBullet: (expId: string, bulletId: string, text: string) => void;
  removeExperienceBullet: (expId: string, bulletId: string) => void;
  updateExperienceTech: (expId: string, tech: string[]) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (items: Experience[]) => void;

  // Skills
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, field: string, value: string | string[]) => void;
  removeSkillCategory: (id: string) => void;
  reorderSkills: (items: SkillCategory[]) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, field: string, value: string) => void;
  addProjectBullet: (projId: string) => void;
  updateProjectBullet: (projId: string, bulletId: string, text: string) => void;
  removeProjectBullet: (projId: string, bulletId: string) => void;
  updateProjectTech: (projId: string, tech: string[]) => void;
  removeProject: (id: string) => void;
  reorderProjects: (items: Project[]) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;
  reorderLanguages: (items: Language[]) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (items: Certification[]) => void;

  // Sections
  toggleSectionVisibility: (id: string) => void;
  reorderSections: (sections: CVSection[]) => void;

  // UI
  setTemplate: (t: TemplateType) => void;
  setColorTheme: (c: ColorTheme) => void;
  setViewMode: (m: ViewMode) => void;
  setActiveEditor: (e: ActiveEditor) => void;
  setZoom: (z: number) => void;
  resetToDefault: () => void;
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cvData: defaultCVData,
      template: 'classic',
      colorTheme: 'slate',
      viewMode: 'split',
      activeEditor: 'personal',
      zoom: 100,

      updatePersonalInfo: (field, value) =>
        set((s) => ({ cvData: { ...s.cvData, personalInfo: { ...s.cvData.personalInfo, [field]: value } } })),

      updateProfile: (value) =>
        set((s) => ({ cvData: { ...s.cvData, profile: value } })),

      // Education
      addEducation: () =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            education: [
              ...s.cvData.education,
              {
                id: uuidv4(), institution: '', degree: '', field: '',
                startDate: '', endDate: '', location: '', description: '', current: false,
              },
            ],
          },
        })),
      updateEducation: (id, field, value) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            education: s.cvData.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
          },
        })),
      removeEducation: (id) =>
        set((s) => ({ cvData: { ...s.cvData, education: s.cvData.education.filter((e) => e.id !== id) } })),
      reorderEducation: (items) =>
        set((s) => ({ cvData: { ...s.cvData, education: items } })),

      // Experience
      addExperience: () =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            experience: [
              ...s.cvData.experience,
              {
                id: uuidv4(), company: '', position: '', type: 'Full-time',
                startDate: '', endDate: '', location: '', description: '',
                bullets: [], technologies: [], current: false,
              },
            ],
          },
        })),
      updateExperience: (id, field, value) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            experience: s.cvData.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
          },
        })),
      addExperienceBullet: (expId) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            experience: s.cvData.experience.map((e) =>
              e.id === expId
                ? { ...e, bullets: [...e.bullets, { id: uuidv4(), text: '' }] }
                : e
            ),
          },
        })),
      updateExperienceBullet: (expId, bulletId, text) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            experience: s.cvData.experience.map((e) =>
              e.id === expId
                ? { ...e, bullets: e.bullets.map((b: BulletItem) => (b.id === bulletId ? { ...b, text } : b)) }
                : e
            ),
          },
        })),
      removeExperienceBullet: (expId, bulletId) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            experience: s.cvData.experience.map((e) =>
              e.id === expId
                ? { ...e, bullets: e.bullets.filter((b: BulletItem) => b.id !== bulletId) }
                : e
            ),
          },
        })),
      updateExperienceTech: (expId, tech) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            experience: s.cvData.experience.map((e) => (e.id === expId ? { ...e, technologies: tech } : e)),
          },
        })),
      removeExperience: (id) =>
        set((s) => ({ cvData: { ...s.cvData, experience: s.cvData.experience.filter((e) => e.id !== id) } })),
      reorderExperience: (items) =>
        set((s) => ({ cvData: { ...s.cvData, experience: items } })),

      // Skills
      addSkillCategory: () =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            skills: [...s.cvData.skills, { id: uuidv4(), category: '', skills: [] }],
          },
        })),
      updateSkillCategory: (id, field, value) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            skills: s.cvData.skills.map((sk) => (sk.id === id ? { ...sk, [field]: value } : sk)),
          },
        })),
      removeSkillCategory: (id) =>
        set((s) => ({ cvData: { ...s.cvData, skills: s.cvData.skills.filter((sk) => sk.id !== id) } })),
      reorderSkills: (items) =>
        set((s) => ({ cvData: { ...s.cvData, skills: items } })),

      // Projects
      addProject: () =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            projects: [
              ...s.cvData.projects,
              { id: uuidv4(), name: '', description: '', bullets: [], technologies: [], link: '' },
            ],
          },
        })),
      updateProject: (id, field, value) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            projects: s.cvData.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
          },
        })),
      addProjectBullet: (projId) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            projects: s.cvData.projects.map((p) =>
              p.id === projId ? { ...p, bullets: [...p.bullets, { id: uuidv4(), text: '' }] } : p
            ),
          },
        })),
      updateProjectBullet: (projId, bulletId, text) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            projects: s.cvData.projects.map((p) =>
              p.id === projId
                ? { ...p, bullets: p.bullets.map((b: BulletItem) => (b.id === bulletId ? { ...b, text } : b)) }
                : p
            ),
          },
        })),
      removeProjectBullet: (projId, bulletId) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            projects: s.cvData.projects.map((p) =>
              p.id === projId ? { ...p, bullets: p.bullets.filter((b: BulletItem) => b.id !== bulletId) } : p
            ),
          },
        })),
      updateProjectTech: (projId, tech) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            projects: s.cvData.projects.map((p) => (p.id === projId ? { ...p, technologies: tech } : p)),
          },
        })),
      removeProject: (id) =>
        set((s) => ({ cvData: { ...s.cvData, projects: s.cvData.projects.filter((p) => p.id !== id) } })),
      reorderProjects: (items) =>
        set((s) => ({ cvData: { ...s.cvData, projects: items } })),

      // Languages
      addLanguage: () =>
        set((s) => ({
          cvData: { ...s.cvData, languages: [...s.cvData.languages, { id: uuidv4(), name: '', level: 'B1' }] },
        })),
      updateLanguage: (id, field, value) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            languages: s.cvData.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
          },
        })),
      removeLanguage: (id) =>
        set((s) => ({ cvData: { ...s.cvData, languages: s.cvData.languages.filter((l) => l.id !== id) } })),
      reorderLanguages: (items) =>
        set((s) => ({ cvData: { ...s.cvData, languages: items } })),

      // Certifications
      addCertification: () =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            certifications: [...s.cvData.certifications, { id: uuidv4(), name: '', issuer: '', date: '', url: '' }],
          },
        })),
      updateCertification: (id, field, value) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            certifications: s.cvData.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
          },
        })),
      removeCertification: (id) =>
        set((s) => ({
          cvData: { ...s.cvData, certifications: s.cvData.certifications.filter((c) => c.id !== id) },
        })),
      reorderCertifications: (items) =>
        set((s) => ({ cvData: { ...s.cvData, certifications: items } })),

      // Sections
      toggleSectionVisibility: (id) =>
        set((s) => ({
          cvData: {
            ...s.cvData,
            sections: s.cvData.sections.map((sec) =>
              sec.id === id ? { ...sec, visible: !sec.visible } : sec
            ),
          },
        })),
      reorderSections: (sections) =>
        set((s) => ({ cvData: { ...s.cvData, sections } })),

      // UI
      setTemplate: (t) => set({ template: t }),
      setColorTheme: (c) => set({ colorTheme: c }),
      setViewMode: (m) => set({ viewMode: m }),
      setActiveEditor: (e) => set({ activeEditor: e }),
      setZoom: (z) => set({ zoom: z }),
      resetToDefault: () => set({ cvData: defaultCVData }),
    }),
    { name: 'cv-builder-storage' }
  )
);
