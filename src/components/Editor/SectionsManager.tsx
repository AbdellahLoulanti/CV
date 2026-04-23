import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCVStore } from '../../store/cvStore';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { CVSection } from '../../types/cv';

const SECTION_ICONS: Record<string, string> = {
  profile: '👤',
  education: '🎓',
  experience: '💼',
  skills: '⚡',
  projects: '🚀',
  languages: '🌍',
  certifications: '🏆',
};

const SortableSectionRow: React.FC<{ section: CVSection }> = ({ section }) => {
  const { toggleSectionVisibility } = useCVStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 bg-white border border-slate-200 
      rounded-xl px-3 py-2.5 shadow-sm group">
      <button {...attributes} {...listeners} type="button"
        className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
        <GripVertical size={16} />
      </button>
      <span className="text-base">{SECTION_ICONS[section.type] || '📄'}</span>
      <span className="flex-1 text-sm font-medium text-slate-700">{section.label}</span>
      <button
        type="button"
        onClick={() => toggleSectionVisibility(section.id)}
        className={`p-1.5 rounded-lg transition-colors ${
          section.visible
            ? 'text-indigo-600 hover:bg-indigo-50'
            : 'text-slate-300 hover:bg-slate-100'
        }`}
      >
        {section.visible ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
    </div>
  );
};

export const SectionsManager: React.FC = () => {
  const { cvData, reorderSections } = useCVStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = cvData.sections.findIndex((s) => s.id === active.id);
      const newIdx = cvData.sections.findIndex((s) => s.id === over.id);
      reorderSections(arrayMove(cvData.sections, oldIdx, newIdx));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 border border-slate-200">
        Drag to reorder sections. Click the eye icon to show/hide a section in your CV.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cvData.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {cvData.sections.map((section) => (
            <SortableSectionRow key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
