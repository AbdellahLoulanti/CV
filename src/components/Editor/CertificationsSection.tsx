import React, { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../UI/FormField';
import { SortableItem } from '../UI/SortableItem';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CertificationsSection: React.FC = () => {
  const { cvData, addCertification, updateCertification, removeCertification, reorderCertifications } = useCVStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = cvData.certifications.findIndex((c) => c.id === active.id);
      const newIdx = cvData.certifications.findIndex((c) => c.id === over.id);
      reorderCertifications(arrayMove(cvData.certifications, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.certifications.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cvData.certifications.map((cert) => (
            <SortableItem key={cert.id} id={cert.id} className="pl-4">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpanded(expanded === cert.id ? null : cert.id)}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {cert.name || <span className="text-slate-400 font-normal">Untitled Certification</span>}
                    </p>
                    {cert.issuer && <p className="text-xs text-slate-500">{cert.issuer}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeCertification(cert.id); }}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === cert.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>
                <AnimatePresence>
                  {expanded === cert.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                        <div className="pt-3">
                          <Input label="Certification Name" value={cert.name}
                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                            placeholder="AWS Certified Developer" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input label="Issuing Organization" value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                            placeholder="Amazon Web Services" />
                          <Input label="Date" value={cert.date}
                            onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                            placeholder="06/2024" />
                        </div>
                        <Input label="Credential URL" value={cert.url}
                          onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                          placeholder="https://verify.example.com/..." />
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
        onClick={addCertification}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed 
          border-slate-200 rounded-xl text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600
          hover:bg-indigo-50 transition-all duration-150"
      >
        <Plus size={16} /> Add Certification
      </button>
    </div>
  );
};
