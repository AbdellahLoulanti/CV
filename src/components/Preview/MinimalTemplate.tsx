import React from 'react';
import { CVData, ColorTheme } from '../../types/cv';
import { themeConfigs } from '../../data/defaultData';

interface Props {
  data: CVData;
  theme: ColorTheme;
}

const ACCENT_HEX: Record<ColorTheme, string> = {
  slate: '#475569', blue: '#2563eb', purple: '#7c3aed',
  green: '#16a34a', red: '#dc2626', orange: '#ea580c', teal: '#0d9488',
};

export const MinimalTemplate: React.FC<Props> = ({ data, theme }) => {
  const accent = ACCENT_HEX[theme];
  const { personalInfo, profile, education, experience, skills, projects, languages, certifications, sections } = data;
  const visibleSections = sections.filter((s) => s.visible);

  const Divider = () => <div className="my-3 border-t border-gray-100" />;

  const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-1 h-4 rounded-full" style={{ background: accent }} />
      <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">{title}</h2>
    </div>
  );

  const renderSection = (type: string) => {
    switch (type) {
      case 'profile':
        return profile ? (
          <section key="profile" className="mb-4">
            <SectionLabel title="About" />
            <p className="text-[10px] leading-relaxed text-gray-600 pl-4">{profile}</p>
          </section>
        ) : null;

      case 'education':
        return education.length ? (
          <section key="education" className="mb-4">
            <SectionLabel title="Education" />
            <div className="pl-4 space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-800">{edu.institution}</p>
                    <p className="text-[9px] text-gray-500">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-[9px] text-gray-400">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </p>
                    {edu.location && <p className="text-[9px] text-gray-400">{edu.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'experience':
        return experience.length ? (
          <section key="experience" className="mb-4">
            <SectionLabel title="Experience" />
            <div className="pl-4 space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-900">{exp.position}</p>
                      <p className="text-[9px] font-medium" style={{ color: accent }}>
                        {exp.company}{exp.type !== 'Full-time' ? ` · ${exp.type}` : ''}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-[8px] text-gray-400 whitespace-nowrap">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </p>
                      {exp.location && <p className="text-[8px] text-gray-400">{exp.location}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-[9px] text-gray-500 mt-1 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.bullets.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.bullets.map((b) => (
                        <li key={b.id} className="text-[9px] text-gray-600 flex items-start gap-1.5">
                          <span className="flex-shrink-0 mt-0.5" style={{ color: accent }}>–</span>
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies.length > 0 && (
                    <p className="text-[9px] text-gray-400 mt-1">
                      {exp.technologies.join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'skills':
        return skills.length ? (
          <section key="skills" className="mb-4">
            <SectionLabel title="Skills" />
            <div className="pl-4 space-y-1.5">
              {skills.map((sk) => (
                <div key={sk.id} className="flex gap-3">
                  <p className="text-[9px] font-semibold text-gray-600 w-24 flex-shrink-0 pt-0.5">{sk.category}</p>
                  <p className="text-[9px] text-gray-500">{sk.skills.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return projects.length ? (
          <section key="projects" className="mb-4">
            <SectionLabel title="Projects" />
            <div className="pl-4 space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <p className="text-[10px] font-semibold text-gray-800">{proj.name}</p>
                  {proj.description && <p className="text-[9px] text-gray-500 mt-0.5">{proj.description}</p>}
                  {proj.bullets.map((b) => (
                    <p key={b.id} className="text-[9px] text-gray-600 mt-0.5 flex items-start gap-1.5">
                      <span style={{ color: accent }}>–</span> {b.text}
                    </p>
                  ))}
                  {proj.technologies.length > 0 && (
                    <p className="text-[9px] text-gray-400 mt-0.5">{proj.technologies.join(' · ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'languages':
        return languages.length ? (
          <section key="languages" className="mb-4">
            <SectionLabel title="Languages" />
            <div className="pl-4 flex flex-wrap gap-x-6 gap-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-gray-700">{lang.name}</span>
                  <span className="text-[9px] text-gray-400">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'certifications':
        return certifications.length ? (
          <section key="certifications" className="mb-4">
            <SectionLabel title="Certifications" />
            <div className="pl-4 space-y-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-gray-700">{cert.name}</span>
                    {cert.issuer && <span className="text-[9px] text-gray-400"> · {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="text-[9px] text-gray-400 flex-shrink-0 ml-2">{cert.date}</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null;

      default: return null;
    }
  };

  return (
    <div className="bg-white w-full h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div className="mb-5 pb-4 border-b-2" style={{ borderColor: accent + '30' }}>
        <div className="flex items-center gap-4">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
          )}
          <div className="flex-1">
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight">{personalInfo.name}</h1>
            {personalInfo.title && (
              <p className="text-[10px] font-medium mt-0.5" style={{ color: accent }}>{personalInfo.title}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
          {[
            { v: personalInfo.email, i: '✉' },
            { v: personalInfo.phone, i: '☎' },
            { v: personalInfo.location, i: '⌖' },
            { v: personalInfo.linkedin, i: 'in' },
            { v: personalInfo.github, i: '⊕' },
            { v: personalInfo.website, i: '⊗' },
          ].filter((c) => c.v).map((c) => (
            <span key={c.i} className="text-[9px] text-gray-500 flex items-center gap-1">
              <span className="text-gray-300">{c.i}</span> {c.v}
            </span>
          ))}
        </div>
      </div>

      {/* Sections */}
      {visibleSections.map((sec) => renderSection(sec.type))}
    </div>
  );
};
