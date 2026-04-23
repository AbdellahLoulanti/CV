import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '../../store/cvStore';
import { PersonalInfoSection } from './PersonalInfoSection';
import { ProfileSection } from './ProfileSection';
import { EducationSection } from './EducationSection';
import { ExperienceSection } from './ExperienceSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { LanguagesSection } from './LanguagesSection';
import { CertificationsSection } from './CertificationsSection';
import { SectionsManager } from './SectionsManager';
import {
  User, AlignLeft, GraduationCap, Briefcase, Zap, FolderOpen, Globe, Award, LayoutGrid,
  ChevronRight,
} from 'lucide-react';

type EditorTab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

const TABS: EditorTab[] = [
  { id: 'personal', label: 'Personal Info', icon: <User size={16} />, component: <PersonalInfoSection /> },
  { id: 'profile', label: 'Profile', icon: <AlignLeft size={16} />, component: <ProfileSection /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase size={16} />, component: <ExperienceSection /> },
  { id: 'education', label: 'Education', icon: <GraduationCap size={16} />, component: <EducationSection /> },
  { id: 'skills', label: 'Skills', icon: <Zap size={16} />, component: <SkillsSection /> },
  { id: 'projects', label: 'Projects', icon: <FolderOpen size={16} />, component: <ProjectsSection /> },
  { id: 'languages', label: 'Languages', icon: <Globe size={16} />, component: <LanguagesSection /> },
  { id: 'certifications', label: 'Certifications', icon: <Award size={16} />, component: <CertificationsSection /> },
  { id: 'sections', label: 'Manage Sections', icon: <LayoutGrid size={16} />, component: <SectionsManager /> },
];

export const EditorPanel: React.FC = () => {
  const { activeEditor, setActiveEditor } = useCVStore();

  const activeTab = TABS.find((t) => t.id === activeEditor) ?? TABS[0];

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar nav */}
      <div className="w-14 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            title={tab.label}
            onClick={() => setActiveEditor(tab.id as any)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 ${
              activeEditor === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Section header */}
        <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center gap-2">
          <span className={`p-1.5 rounded-lg bg-indigo-50 text-indigo-600`}>{activeTab.icon}</span>
          <h2 className="text-sm font-semibold text-slate-800">{activeTab.label}</h2>
          <ChevronRight size={14} className="text-slate-300" />
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEditor}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
