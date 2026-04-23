import React from 'react';
import { useCVStore } from './store/cvStore';
import { Header } from './components/Header';
import { EditorPanel } from './components/Editor/EditorPanel';
import { PreviewPanel } from './components/Preview/PreviewPanel';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { viewMode } = useCVStore();

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header />

      <main className="flex-1 flex overflow-hidden">
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
    </div>
  );
}

export default App;
