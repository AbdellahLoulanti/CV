import React from 'react';
import { useCVStore } from './store/cvStore';
import { Header } from './components/Header';
import { EditorPanel } from './components/Editor/EditorPanel';
import { PreviewPanel } from './components/Preview/PreviewPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Eye } from 'lucide-react';

function App() {
  const { viewMode, setViewMode } = useCVStore();

  // On mobile 'split' is treated as 'edit'
  const mobileActive = viewMode === 'preview' ? 'preview' : 'edit';

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header />

      {/* ── Desktop layout (md+) ── */}
      <main className="hidden md:flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {(viewMode === 'edit' || viewMode === 'split') && (
            <motion.div
              key="editor"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: viewMode === 'split' ? '42%' : '100%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex-shrink-0 border-r border-slate-200 overflow-hidden h-full"
            >
              <EditorPanel />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {(viewMode === 'preview' || viewMode === 'split') && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-hidden h-full"
            >
              <PreviewPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Mobile layout (< md) ── */}
      <main className="flex md:hidden flex-1 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {mobileActive === 'edit' ? (
            <motion.div
              key="mobile-editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden h-full"
            >
              <EditorPanel />
            </motion.div>
          ) : (
            <motion.div
              key="mobile-preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden h-full"
            >
              <PreviewPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="flex md:hidden items-center border-t border-slate-200 bg-white flex-shrink-0">
        {[
          { id: 'edit' as const, label: 'Editor', icon: <Edit3 size={18} /> },
          { id: 'preview' as const, label: 'Preview', icon: <Eye size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              mobileActive === tab.id
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
