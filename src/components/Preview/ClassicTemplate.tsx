import React from 'react';
import { CVData, ColorTheme } from '../../types/cv';
import { themeConfigs } from '../../data/defaultData';

interface Props {
  data: CVData;
  theme: ColorTheme;
}

const SectionHeading: React.FC<{ title: string; themeClass: string }> = ({ title, themeClass }) => (
  <div className="mb-3">
    <h2 className={`text-[11px] font-bold uppercase tracking-[0.15em] ${themeClass} pb-1 border-b-2 ${themeClass.replace('text-', 'border-')}`}>
      {title}
    </h2>
  </div>
);

const TechBadge: React.FC<{ text: string; theme: ColorTheme }> = ({ text, theme }) => {
  const t = themeConfigs[theme];
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium ${t.badge} ${t.badgeText} border ${t.border.replace('border-', 'border-')}`}>
      {text}
    </span>
  );
};

export const ClassicTemplate: React.FC<Props> = ({ data, theme }) => {
  const t = themeConfigs[theme];
  const { personalInfo, profile, education, experience, skills, projects, languages, certifications, sections } = data;

  const visibleSections = sections.filter((s) => s.visible);

  const renderSection = (type: string) => {
    switch (type) {
      case 'profile':
        if (!profile) return null;
        return (
          <section key="profile" className="mb-5">
            <SectionHeading title="Profile" themeClass={t.heading} />
            <p className="text-[10px] leading-relaxed text-gray-700">{profile}</p>
          </section>
        );

      case 'education':
        if (!education.length) return null;
        return (
          <section key="education" className="mb-5">
            <SectionHeading title="Education" themeClass={t.heading} />
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[11px] font-bold text-gray-900">{edu.institution}</span>
                    {edu.field && <span className="text-[10px] text-gray-600">, {edu.field.toLowerCase()}</span>}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-[9px] text-gray-500">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </span>
                    {edu.location && <span className="text-[9px] text-gray-500 block">{edu.location}</span>}
                  </div>
                </div>
                {edu.degree && <p className="text-[10px] text-gray-600 mt-0.5">{edu.degree}</p>}
                {edu.description && <p className="text-[9px] text-gray-600 mt-1 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </section>
        );

      case 'experience':
        if (!experience.length) return null;
        return (
          <section key="experience" className="mb-5">
            <SectionHeading title="Professional Experience" themeClass={t.heading} />
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-[11px] font-bold text-gray-900">{exp.position}</span>
                    {exp.type && exp.type !== 'Full-time' && (
                      <span className="text-[9px] text-gray-500">, {exp.type}</span>
                    )}
                    {exp.company && <span className={`text-[11px] font-bold ${t.accent} ml-1`}> {exp.company}</span>}
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-[9px] text-gray-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                    {exp.location && <span className="text-[9px] text-gray-500 block">{exp.location}</span>}
                  </div>
                </div>
                {exp.description && (
                  <div className="mt-1">
                    <span className="text-[9px] font-semibold text-gray-700">Project: </span>
                    <span className="text-[9px] text-gray-600 leading-relaxed">{exp.description}</span>
                  </div>
                )}
                {exp.bullets.length > 0 && (
                  <div className="mt-1">
                    <p className="text-[9px] font-semibold text-gray-700 mb-0.5">Main contributions:</p>
                    <ul className="space-y-0.5">
                      {exp.bullets.map((b) => (
                        <li key={b.id} className="flex items-start gap-1.5 text-[9px] text-gray-600 leading-relaxed">
                          <span className="mt-0.5 flex-shrink-0 text-gray-400">•</span>
                          {b.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.technologies.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span className="text-[9px] font-semibold text-gray-700 mr-1">Technologies:</span>
                    {exp.technologies.map((tech) => (
                      <TechBadge key={tech} text={tech} theme={theme} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case 'skills':
        if (!skills.length) return null;
        return (
          <section key="skills" className="mb-5">
            <SectionHeading title="Skills" themeClass={t.heading} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {skills.map((sk) => (
                <div key={sk.id}>
                  <p className="text-[10px] font-bold text-gray-800">{sk.category}</p>
                  <p className="text-[10px] text-gray-600">{sk.skills.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!projects.length) return null;
        return (
          <section key="projects" className="mb-5">
            <SectionHeading title="Academic Projects" themeClass={t.heading} />
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <p className="text-[10px] font-bold text-gray-900">{proj.name}</p>
                {proj.description && (
                  <p className="text-[9px] text-gray-600 leading-relaxed mt-0.5">{proj.description}</p>
                )}
                {proj.bullets.map((b) => (
                  <div key={b.id} className="flex items-start gap-1.5 mt-0.5">
                    <span className="text-[9px] text-gray-400 flex-shrink-0 mt-0.5">•</span>
                    <p className="text-[9px] text-gray-600 leading-relaxed">{b.text}</p>
                  </div>
                ))}
                {proj.technologies.length > 0 && (
                  <p className="text-[9px] text-gray-600 mt-0.5">
                    <span className="font-semibold">Tech: </span>
                    {proj.technologies.join(', ')}.
                  </p>
                )}
              </div>
            ))}
          </section>
        );

      case 'languages':
        if (!languages.length) return null;
        return (
          <section key="languages" className="mb-5">
            <SectionHeading title="Languages" themeClass={t.heading} />
            <div className="grid grid-cols-3 gap-3">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <p className="text-[10px] font-bold text-gray-800">{lang.name}</p>
                  <p className="text-[9px] text-gray-500">{lang.level}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'certifications':
        if (!certifications.length) return null;
        return (
          <section key="certifications" className="mb-5">
            <SectionHeading title="Certifications" themeClass={t.heading} />
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline mb-1.5">
                <div>
                  <span className="text-[10px] font-semibold text-gray-800">{cert.name}</span>
                  {cert.issuer && <span className="text-[9px] text-gray-500"> · {cert.issuer}</span>}
                </div>
                {cert.date && <span className="text-[9px] text-gray-500 flex-shrink-0 ml-2">{cert.date}</span>}
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white w-full h-full font-serif" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div className="text-center pb-4 mb-4 border-b border-gray-300">
        <div className="flex items-center justify-center gap-4">
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 border-gray-300" />
          )}
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 tracking-wide uppercase">{personalInfo.name}</h1>
            {personalInfo.title && (
              <p className={`text-[11px] italic ${t.accent} mt-0.5`}>{personalInfo.title}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-2">
          {personalInfo.email && (
            <span className="flex items-center gap-1 text-[9px] text-gray-600">
              <span>✉</span> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1 text-[9px] text-gray-600">
              <span>📞</span> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1 text-[9px] text-gray-600">
              <span>📍</span> {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1 text-[9px] text-gray-600">
              <span>in</span> {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1 text-[9px] text-gray-600">
              <span>⌥</span> {personalInfo.github}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1 text-[9px] text-gray-600">
              <span>🌐</span> {personalInfo.website}
            </span>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="px-1">
        {visibleSections.map((sec) => renderSection(sec.type))}
      </div>
    </div>
  );
};
