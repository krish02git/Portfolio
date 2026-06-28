import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { getTechSvg } from '../utils/techStack';

const ExperienceCard = ({ experience, detailed = false, isHome = false }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (isHome) {
      setExpanded(!expanded);
    }
  };

  const isDetailed = isHome ? expanded : detailed;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col py-5 my-1 border-t border-black dark:border-white transition-all duration-300 relative ${isHome ? 'cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03] px-2 -mx-2' : ''
        }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[15px]">
              {experience.company}
            </h3>
            {experience.jobType && (
              <span className="text-[10px] px-2 py-0.5 rounded-full neo-box-inset font-medium opacity-80">
                {experience.jobType}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted mt-1">{experience.role}</p>
        </div>

        <div className="flex flex-col items-start md:items-end mt-3 md:mt-0 text-[13px] text-muted gap-1">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar size={14} />
            <span>{experience.startDate} to {experience.endDate === 'Present' ? 'Present' : experience.endDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{experience.location}</span>
          </div>
        </div>
      </div>

      {isDetailed && (
        <div className="mt-5 flex flex-col gap-4">
          {experience.responsibilities && experience.responsibilities.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[13px] font-semibold text-[var(--text-main)]">Responsibilities</h4>
              <ul className="list-disc list-outside ml-4 text-[13px] text-muted space-y-1">
                {experience.responsibilities.map((resp, i) => (
                  <li key={i} className="leading-relaxed">{resp}</li>
                ))}
              </ul>
            </div>
          )}

          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <h4 className="text-[13px] font-semibold text-[var(--text-main)]">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => {
                  const svgContent = getTechSvg(tech);
                  return (
                    <div
                      key={tech}
                      className="flex items-center justify-center gap-0 hover:gap-2 neo-box-inset !rounded-full p-2 hover:px-4 text-[11px] font-medium text-muted hover:text-[var(--text-main)] transition-all duration-500 ease-out cursor-default group overflow-hidden"
                      title={tech}
                    >
                      {svgContent && (
                        <span
                          className="w-4 h-4 shrink-0 inline-flex items-center justify-center tech-svg"
                          dangerouslySetInnerHTML={{ __html: svgContent }}
                        />
                      )}
                      <span className={`transition-all duration-500 ease-out whitespace-nowrap overflow-hidden font-semibold ${svgContent ? 'max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100' : ''}`}>{tech}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {isHome && hovered && (
        <span className="absolute bottom-2 right-4 text-[11px] text-[var(--accent)] font-medium animate-pulse">
          {expanded ? '← Collapse' : '→ Open Full'}
        </span>
      )}
    </div>
  );
};

export default ExperienceCard;
