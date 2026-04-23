import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useCVStore } from '../../store/cvStore';
import { Input, TagInput } from '../UI/FormField';
import { SortableItem } from '../UI/SortableItem';
import { Plus, Trash2 } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { cvData, addSkillCategory, updateSkillCategory, removeSkillCategory, reorderSkills } = useCVStore();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = cvData.skills.findIndex((s) => s.id === active.id);
      const newIdx = cvData.skills.findIndex((s) => s.id === over.id);
      reorderSkills(arrayMove(cvData.skills, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.skills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {cvData.skills.map((sk) => (
            <SortableItem key={sk.id} id={sk.id} className="pl-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      label="Category"
                      value={sk.category}
                      onChange={(e) => updateSkillCategory(sk.id, 'category', e.target.value)}
                      placeholder="e.g. Programming Languages"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkillCategory(sk.id)}
                    className="mt-5 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <TagInput
                  label="Skills"
                  tags={sk.skills}
                  onChange={(skills) => updateSkillCategory(sk.id, 'skills', skills)}
                  placeholder="Add skill & press Enter"
                />
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={addSkillCategory}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-dashed 
          border-slate-200 rounded-xl text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600
          hover:bg-indigo-50 transition-all duration-150"
      >
        <Plus size={16} /> Add Skill Category
      </button>
    </div>
  );
};
