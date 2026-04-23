import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '../store/cvStore';
import { TemplateType, ColorTheme } from '../types/cv';
import {
  LayoutTemplate, Palette, SplitSquareHorizontal, Eye, Edit3,
  RotateCcw, ChevronDown, Check, FileText,
} from 'lucide-react';

const TEMPLATES: { id: TemplateType; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Traditional serif layout' },
  { id: 'modern', label: 'Modern', desc: 'Two-column with sidebar' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean & contemporary' },
];

const COLORS: { id: ColorTheme; hex: string; label: string }[] = [
  { id: 'slate', hex: '#475569', label: 'Slate' },
  { id: 'blue', hex: '#2563eb', label: 'Blue' },
  { id: 'purple', hex: '#7c3aed', label: 'Purple' },
  { id: 'green', hex: '#16a34a', label: 'Green' },
  { id: 'red', hex: '#dc2626', label: 'Red' },
  { id: 'orange', hex: '#ea580c', label: 'Orange' },
  { id: 'teal', hex: '#0d9488', label: 'Teal' },
];

const Dropdown: React.FC<{ trigger: React.ReactNode; children: React.ReactNode }> = ({ trigger, children }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Header: React.FC = () => {
  const { template, colorTheme, viewMode, setTemplate, setColorTheme, setViewMode, resetToDefault } = useCVStore();
  const [showReset, setShowReset] = useState(false);

  const viewModes = [
    { id: 'edit', label: 'Editor', icon: <Edit3 size={14} /> },
    { id: 'split', label: 'Split', icon: <SplitSquareHorizontal size={14} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={14} /> },
  ] as const;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0 z-20">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <FileText size={16} className="text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-slate-900">CV Builder</span>
          <span className="text-xs text-slate-400 ml-1">Pro</span>
        </div>
      </div>

      {/* Center controls */}
      <div className="flex items-center gap-3">
        {/* Template picker */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 
              bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer">
              <LayoutTemplate size={14} className="text-slate-500" />
              <span>{TEMPLATES.find((t) => t.id === template)?.label}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          }
        >
          <div className="p-2 w-48">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide px-2 pb-1">Template</p>
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {template === t.id && <Check size={14} className="text-indigo-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.label}</p>
                  <p className="text-xs text-slate-400">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Color picker */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 
              bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer">
              <Palette size={14} className="text-slate-500" />
              <div className="w-3 h-3 rounded-full" style={{ background: COLORS.find((c) => c.id === colorTheme)?.hex }} />
              <ChevronDown size={12} className="text-slate-400" />
            </button>
          }
        >
          <div className="p-3 w-44">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Color Theme</p>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  title={c.label}
                  onClick={() => setColorTheme(c.id)}
                  className="relative w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{ background: c.hex }}
                >
                  {colorTheme === c.id && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Dropdown>

        {/* View mode */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {viewModes.map((m) => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === m.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m.icon}
              <span className="hidden sm:block">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-red-600 
              hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-all font-medium"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <AnimatePresence>
            {showReset && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-56 z-50"
              >
                <p className="text-sm font-semibold text-slate-800 mb-1">Reset to sample data?</p>
                <p className="text-xs text-slate-500 mb-3">This will replace all your current data.</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowReset(false)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => { resetToDefault(); setShowReset(false); }}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                    Reset
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
