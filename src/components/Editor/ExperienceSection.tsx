import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useCVStore } from '../../store/cvStore';
import { Input, Textarea, Select, TagInput } from '../UI/FormField';
import { SortableItem } from '../UI/SortableItem';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JOB_TYPES = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Volunteer', label: 'Volunteer' },
];

export const ExperienceSection: React.FC = () => {
  const {
    cvData, addExperience, updateExperience, removeExperience, reorderExperience,
    addExperienceBullet, updateExperienceBullet, removeExperienceBullet, updateExperienceTech,
  } = useCVStore();
  const [expanded, setExpanded] = useState<string | null>(cvData.experience[0]?.id ?? null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = cvData.experience.findIndex((e) => e.id === active.id);
      const newIdx = cvData.experience.findIndex((e) => e.id === over.id);
      reorderExperience(arrayMove(cvData.experience, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.experience.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {cvData.experience.map((exp) => (
            <SortableItem key={exp.id} id={exp.id} className="pl-4">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {exp.position || <span className="text-slate-400 font-normal">Untitled Experience</span>}
                    </p>
                    {exp.company && <p className="text-xs text-slate-500">{exp.company} · {exp.type}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === exp.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === exp.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                        <div className="pt-3 grid grid-cols-2 gap-3">
                          <Input label="Company" value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Company Name" />
                          <Input label="Position / Title" value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            placeholder="Software Engineer" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Select label="Type" value={exp.type} options={JOB_TYPES}
                            onChange={(e) => updateExperience(exp.id, 'type', e.target.value)} />
                          <Input label="Start Date" value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="01/2023" />
                          <Input label="End Date" value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="12/2023" disabled={exp.current} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input label="Location" value={exp.location}
                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                            placeholder="City, Country" />
                          <label className="flex items-end gap-2 text-sm text-slate-600 cursor-pointer pb-2">
                            <input type="checkbox" checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600" />
                            Currently working
                          </label>
                        </div>
                        <Textarea label="Project Description" value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Describe the project or your role..." rows={3} />

                        {/* Bullet Points */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                            Key Contributions
                          </label>
                          {exp.bullets.map((bullet, idx) => (
                            <div key={bullet.id} className="flex items-center gap-2">
                              <span className="text-slate-400 text-xs w-4 flex-shrink-0">•</span>
                              <input
                                value={bullet.text}
                                onChange={(e) => updateExperienceBullet(exp.id, bullet.id, e.target.value)}
                                placeholder={`Contribution ${idx + 1}...`}
                                className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg
                                  text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 
                                  focus:ring-indigo-500 focus:border-transparent transition-all"
                              />
                              <button type="button" onClick={() => removeExperienceBullet(exp.id, bullet.id)}
                                className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                          <button type="button" onClick={() => addExperienceBullet(exp.id)}
                            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 
                              font-medium transition-colors py-1">
                            <Plus size={12} /> Add bullet point
                          </button>
                        </div>

                        <TagInput
                          label="Technologies Used"
                          tags={exp.technologies}
                          onChange={(tech) => updateExperienceTech(exp.id, tech)}
                          placeholder="React, Node.js, AWS…"
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
        onClick={addExperience}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed 
          border-slate-200 rounded-xl text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600
          hover:bg-indigo-50 transition-all duration-150"
      >
        <Plus size={16} /> Add Experience
      </button>
    </div>
  );
};
