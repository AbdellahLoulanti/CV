import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useCVStore } from '../../store/cvStore';
import { Input, Select } from '../UI/FormField';
import { SortableItem } from '../UI/SortableItem';
import { Plus, Trash2 } from 'lucide-react';

const LEVELS = [
  { value: 'Native', label: 'Native' },
  { value: 'C2', label: 'C2 – Mastery' },
  { value: 'C1', label: 'C1 – Advanced' },
  { value: 'B2', label: 'B2 – Upper Intermediate' },
  { value: 'B1', label: 'B1 – Intermediate' },
  { value: 'A2', label: 'A2 – Elementary' },
  { value: 'A1', label: 'A1 – Beginner' },
];

export const LanguagesSection: React.FC = () => {
  const { cvData, addLanguage, updateLanguage, removeLanguage, reorderLanguages } = useCVStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = cvData.languages.findIndex((l) => l.id === active.id);
      const newIdx = cvData.languages.findIndex((l) => l.id === over.id);
      reorderLanguages(arrayMove(cvData.languages, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.languages.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {cvData.languages.map((lang) => (
            <SortableItem key={lang.id} id={lang.id} className="pl-4">
              <div className="flex items-end gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                <div className="flex-1">
                  <Input label="Language" value={lang.name}
                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                    placeholder="English" />
                </div>
                <div className="flex-1">
                  <Select label="Proficiency" value={lang.level} options={LEVELS}
                    onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)} />
                </div>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang.id)}
                  className="mb-0.5 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addLanguage}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed 
          border-slate-200 rounded-xl text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600
          hover:bg-indigo-50 transition-all duration-150"
      >
        <Plus size={16} /> Add Language
      </button>
    </div>
  );
};
