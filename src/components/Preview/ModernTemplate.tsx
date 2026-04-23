import React from 'react';
import { CVData, ColorTheme } from '../../types/cv';
import { themeConfigs } from '../../data/defaultData';

interface Props {
  data: CVData;
  theme: ColorTheme;
}

const COLOR_HEX: Record<ColorTheme, { bg: string; text: string; light: string }> = {
  slate:  { bg: '#334155', text: '#ffffff', light: '#f1f5f9' },
  blue:   { bg: '#1d4ed8', text: '#ffffff', light: '#eff6ff' },
  purple: { bg: '#7c3aed', text: '#ffffff', light: '#f5f3ff' },
  green:  { bg: '#15803d', text: '#ffffff', light: '#f0fdf4' },
  red:    { bg: '#b91c1c', text: '#ffffff', light: '#fef2f2' },
  orange: { bg: '#c2410c', text: '#ffffff', light: '#fff7ed' },
  teal:   { bg: '#0f766e', text: '#ffffff', light: '#f0fdfa' },
};

export const ModernTemplate: React.FC<Props> = ({ data, theme }) => {
  const colors = COLOR_HEX[theme];
  const { personalInfo, profile, education, experience, skills, projects, languages, certifications, sections } = data;
  const visibleSections = sections.filter((s) => s.visible);

  const leftSections = ['profile', 'skills', 'languages', 'certifications'];
  const rightSections = ['education', 'experience', 'projects'];

  const leftVisible = visibleSections.filter((s) => leftSections.includes(s.type));
  const rightVisible = visibleSections.filter((s) => rightSections.includes(s.type));

  const SectionTitle: React.FC<{ title: string; light?: boolean }> = ({ title, light }) => (
    <div className="mb-2 pb-1" style={{ borderBottom: `1px solid ${light ? 'rgba(255,255,255,0.3)' : colors.bg + '30'}` }}>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{ color: light ? 'rgba(255,255,255,0.85)' : colors.bg }}>
        {title}
      </h2>
    </div>
  );

  const renderLeft = (type: string) => {
    switch (type) {
      case 'profile':
        return profile ? (
          <section key="profile" className="mb-4">
            <SectionTitle title="Profile" light />
            <p className="text-[9px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{profile}</p>
          </section>
        ) : null;

      case 'skills':
        return skills.length ? (
          <section key="skills" className="mb-4">
            <SectionTitle title="Skills" light />
            {skills.map((sk) => (
              <div key={sk.id} className="mb-2">
                <p className="text-[9px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{sk.category}</p>
                <div className="flex flex-wrap gap-1">
                  {sk.skills.map((s) => (
                    <span key={s} className="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: 'rgba(255,255,255,0.15)', color: colors.text }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null;

      case 'languages':
        return languages.length ? (
          <section key="languages" className="mb-4">
            <SectionTitle title="Languages" light />
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{lang.name}</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.2)', color: colors.text }}>
                  {lang.level}
                </span>
              </div>
            ))}
          </section>
        ) : null;

      case 'certifications':
        return certifications.length ? (
          <section key="certifications" className="mb-4">
            <SectionTitle title="Certifications" light />
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <p className="text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{cert.name}</p>
                {cert.issuer && <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{cert.issuer} · {cert.date}</p>}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  const renderRight = (type: string) => {
    switch (type) {
      case 'education':
        return education.length ? (
          <section key="education" className="mb-4">
            <SectionTitle title="Education" />
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">{edu.institution}</p>
                    <p className="text-[9px] text-gray-600">{edu.degree}{edu.field ? ` – ${edu.field}` : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[8px] text-gray-500 whitespace-nowrap">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </p>
                    {edu.location && <p className="text-[8px] text-gray-500">{edu.location}</p>}
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : null;

      case 'experience':
        return experience.length ? (
          <section key="experience" className="mb-4">
            <SectionTitle title="Experience" />
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">{exp.position}</p>
                    <p className="text-[9px] font-medium" style={{ color: colors.bg }}>{exp.company} · {exp.type}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[8px] text-gray-500 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.location && <p className="text-[8px] text-gray-500">{exp.location}</p>}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-[9px] text-gray-600 mt-1 leading-relaxed">{exp.description}</p>
                )}
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.map((b) => (
                      <li key={b.id} className="flex items-start gap-1.5 text-[9px] text-gray-600">
                        <span className="flex-shrink-0 mt-0.5" style={{ color: colors.bg }}>▸</span>
                        {b.text}
                      </li>
                    ))}
                  </ul>
                )}
                {exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {exp.technologies.map((tech) => (
                      <span key={tech}
                        className="text-[8px] px-1.5 py-px rounded font-medium"
                        style={{ background: colors.light, color: colors.bg }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return projects.length ? (
          <section key="projects" className="mb-4">
            <SectionTitle title="Projects" />
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <p className="text-[10px] font-bold text-gray-900">{proj.name}</p>
                {proj.description && <p className="text-[9px] text-gray-600 mt-0.5">{proj.description}</p>}
                {proj.bullets.map((b) => (
                  <div key={b.id} className="flex items-start gap-1.5 mt-0.5">
                    <span className="text-[9px] flex-shrink-0 mt-0.5" style={{ color: colors.bg }}>▸</span>
                    <p className="text-[9px] text-gray-600 leading-relaxed">{b.text}</p>
                  </div>
                ))}
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] text-gray-600 mt-0.5">
                    <span className="font-semibold">Stack: </span>
                    {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  return (
    <div className="bg-white w-full h-full flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left sidebar */}
      <div className="w-[38%] flex-shrink-0 p-5" style={{ background: colors.bg }}>
        {/* Photo + Name */}
        <div className="text-center mb-5">
          {personalInfo.photo ? (
            <img src={personalInfo.photo} alt="Profile"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border-2"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
          ) : (
            <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-xl font-bold"
              style={{ background: 'rgba(255,255,255,0.2)', color: colors.text }}>
              {personalInfo.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          )}
          <h1 className="text-[14px] font-bold leading-tight" style={{ color: colors.text }}>
            {personalInfo.name}
          </h1>
          {personalInfo.title && (
            <p className="text-[9px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="mb-4 space-y-1">
          {[
            { icon: '✉', val: personalInfo.email },
            { icon: '📞', val: personalInfo.phone },
            { icon: '📍', val: personalInfo.location },
            { icon: 'in', val: personalInfo.linkedin },
            { icon: '⌥', val: personalInfo.github },
            { icon: '🌐', val: personalInfo.website },
          ].filter((c) => c.val).map((c) => (
            <div key={c.icon} className="flex items-center gap-1.5">
              <span className="text-[9px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.icon}</span>
              <span className="text-[9px] break-all" style={{ color: 'rgba(255,255,255,0.85)' }}>{c.val}</span>
            </div>
          ))}
        </div>

        {leftVisible.map((sec) => renderLeft(sec.type))}
      </div>

      {/* Right content */}
      <div className="flex-1 p-5">
        {rightVisible.map((sec) => renderRight(sec.type))}
      </div>
    </div>
  );
};
