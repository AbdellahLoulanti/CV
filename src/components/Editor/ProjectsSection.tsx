import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useCVStore } from '../../store/cvStore';
import { Input, Textarea, TagInput } from '../UI/FormField';
import { SortableItem } from '../UI/SortableItem';
import { Plus, Trash2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectsSection: React.FC = () => {
  const {
    cvData, addProject, updateProject, removeProject, reorderProjects,
    addProjectBullet, updateProjectBullet, removeProjectBullet, updateProjectTech,
  } = useCVStore();
  const [expanded, setExpanded] = useState<string | null>(cvData.projects[0]?.id ?? null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = cvData.projects.findIndex((p) => p.id === active.id);
      const newIdx = cvData.projects.findIndex((p) => p.id === over.id);
      reorderProjects(arrayMove(cvData.projects, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          {cvData.projects.map((proj) => (
            <SortableItem key={proj.id} id={proj.id} className="pl-4">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {proj.name || <span className="text-slate-400 font-normal">Untitled Project</span>}
                    </p>
                    {proj.technologies.length > 0 && (
                      <p className="text-xs text-slate-500">{proj.technologies.slice(0, 3).join(', ')}{proj.technologies.length > 3 ? '…' : ''}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === proj.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === proj.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                        <div className="pt-3">
                          <Input label="Project Name" value={proj.name}
                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                            placeholder="My Awesome Project" />
                        </div>
                        <div className="relative">
                          <ExternalLink size={14} className="absolute left-3 top-[30px] text-slate-400 z-10" />
                          <Input label="Project Link" value={proj.link}
                            onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                            placeholder="github.com/user/project"
                            className="pl-8" />
                        </div>
                        <Textarea label="Description" value={proj.description}
                          onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                          placeholder="Brief project description..." rows={2} />

                        {/* Bullet Points */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Highlights
                          </label>
                          {proj.bullets.map((bullet, idx) => (
                            <div key={bullet.id} className="flex items-center gap-2">
                              <span className="text-slate-400 text-xs w-4 flex-shrink-0">•</span>
                              <input
                                value={bullet.text}
                                onChange={(e) => updateProjectBullet(proj.id, bullet.id, e.target.value)}
                                placeholder={`Highlight ${idx + 1}...`}
                                className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg
                                  text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 
                                  focus:ring-indigo-500 focus:border-transparent transition-all"
                              />
                              <button type="button" onClick={() => removeProjectBullet(proj.id, bullet.id)}
                                className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addProjectBullet(proj.id)}
                            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 
                              font-medium transition-colors py-1">
                            <Plus size={12} /> Add highlight
                          </button>
                        </div>

                        <TagInput
                          label="Technologies"
                          tags={proj.technologies}
                          onChange={(tech) => updateProjectTech(proj.id, tech)}
                          placeholder="React, TypeScript…"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addProject}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed 
          border-slate-200 rounded-xl text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600
          hover:bg-indigo-50 transition-all duration-150"
      >
        <Plus size={16} /> Add Project
      </button>
    </div>
  );
};
