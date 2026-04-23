import React from 'react';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../UI/FormField';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe, Camera } from 'lucide-react';

export const PersonalInfoSection: React.FC = () => {
  const { cvData, updatePersonalInfo } = useCVStore();
  const { personalInfo } = cvData;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updatePersonalInfo('photo', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Photo Upload */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 
          overflow-hidden flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-indigo-400 transition-colors group">
          {personalInfo.photo ? (
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={24} className="text-slate-300" />
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 
            group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera size={16} className="text-white" />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
          </label>
        </div>
        <div className="flex-1 space-y-3">
          <Input
            label="Full Name"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            placeholder="John Doe"
          />
          <Input
            label="Professional Title"
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            placeholder="Software Engineer – Web & DevOps"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-[30px] text-slate-400 z-10" />
          <Input
            label="Email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="you@email.com"
            className="pl-8"
          />
        </div>
        <div className="relative">
          <Phone size={14} className="absolute left-3 top-[30px] text-slate-400 z-10" />
          <Input
            label="Phone"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="+1 234 567 890"
            className="pl-8"
          />
        </div>
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-[30px] text-slate-400 z-10" />
          <Input
            label="Location"
            value={personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="City, Country"
            className="pl-8"
          />
        </div>
        <div className="relative">
          <Globe size={14} className="absolute left-3 top-[30px] text-slate-400 z-10" />
          <Input
            label="Website"
            value={personalInfo.website}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            placeholder="yoursite.com"
            className="pl-8"
          />
        </div>
        <div className="relative">
          <Linkedin size={14} className="absolute left-3 top-[30px] text-slate-400 z-10" />
          <Input
            label="LinkedIn"
            value={personalInfo.linkedin}
            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
            className="pl-8"
          />
        </div>
        <div className="relative">
          <Github size={14} className="absolute left-3 top-[30px] text-slate-400 z-10" />
          <Input
            label="GitHub"
            value={personalInfo.github}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
            placeholder="github.com/username"
            className="pl-8"
          />
        </div>
      </div>
    </div>
  );
};
