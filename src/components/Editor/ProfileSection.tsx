import React from 'react';
import { useCVStore } from '../../store/cvStore';
import { Textarea } from '../UI/FormField';

export const ProfileSection: React.FC = () => {
  const { cvData, updateProfile } = useCVStore();
  return (
    <div>
      <Textarea
        label="Professional Summary"
        value={cvData.profile}
        onChange={(e) => updateProfile(e.target.value)}
        placeholder="Write a compelling professional summary that highlights your key skills, experience, and career goals..."
        rows={5}
      />
      <p className="mt-1 text-xs text-slate-400">{cvData.profile.length} characters</p>
    </div>
  );
};
