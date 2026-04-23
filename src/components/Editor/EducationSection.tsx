import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useCVStore } from '../../store/cvStore';
import { Input, Textarea } from '../UI/FormField';
import { SortableItem } from '../UI/SortableItem';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EducationSection: React.FC = () => {
  const { cvData, addEducation, updateEducation, removeEducation, reorderEducation } = useCVStore();
  const [expanded, setExpanded] = useState<string | null>(cvData.education[0]?.id ?? null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.education.findIndex((e) => e.id === active.id);
      const newIndex = cvData.education.findIndex((e) => e.id === over.id);
      reorderEducation(arrayMove(cvData.education, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.education.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          {cvData.education.map((edu) => (
            <SortableItem key={edu.id} id={edu.id} className="pl-4">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {edu.institution || <span className="text-slate-400 font-normal">Untitled Education</span>}
                    </p>
                    {edu.degree && (
                      <p className="text-xs text-slate-500">{edu.degree}{edu.field ? ` – ${edu.field}` : ''}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === edu.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === edu.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                        <div className="pt-3">
                          <Input label="Institution" value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="University Name" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input label="Degree" value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Bachelor's" />
                          <Input label="Field of Study" value={edu.field}
                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                            placeholder="Computer Science" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Input label="Start Date" value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                            placeholder="09/2020" />
                          <Input label="End Date" value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                            placeholder="06/2024"
                            disabled={edu.current} />
                          <Input label="Location" value={edu.location}
                            onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                            placeholder="City, Country" />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="checkbox" checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600" />
                          Currently studying here
                        </label>
                        <Textarea label="Description (optional)" value={edu.description}
                          onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                          placeholder="Relevant coursework, achievements..." rows={3} />
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
        onClick={() => { addEducation(); }}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed 
          border-slate-200 rounded-xl text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600
          hover:bg-indigo-50 transition-all duration-150"
      >
        <Plus size={16} /> Add Education
      </button>
    </div>
  );
};
