import { useState } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { getTechSvg } from '../utils/techStack';

const GitHubIcon = ({ size = 15 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const ProjectCard = ({ project, detailed = false, isHome = false }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (isHome) {
      setExpanded(!expanded);
    }
  };

  const isDetailed = isHome ? expanded : detailed;

  const githubLinks = Array.isArray(project.githubLink)
    ? project.githubLink
    : (project.githubLink ? [project.githubLink] : []);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col py-5 my-1 border-t border-black dark:border-white transition-all duration-300 relative ${isHome ? 'cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03] px-2 -mx-2' : ''
        }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[15px]">
              {project.title}
            </h3>
            {project.type && (
              <span className="text-[10px] px-2 py-0.5 rounded-full neo-box-inset font-medium opacity-80">
                {project.type}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted mt-1">{project.description}</p>
        </div>

        <div className="flex flex-col items-start sm:items-end mt-3 sm:mt-0 text-[13px] text-muted gap-2 shrink-0">
          {(project.startDate || project.endDate) && (
            <div className="flex items-center gap-1.5 font-medium mb-1">
              <Calendar size={14} />
              <span>{project.startDate} to {project.endDate || 'Present'}</span>
            </div>
          )}
          <div className="flex flex-col items-start sm:items-end gap-2">
            {githubLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[var(--text-main)] transition-colors text-[12px]"
                title="GitHub"
                onClick={(e) => e.stopPropagation()}
              >
                <GitHubIcon size={14} />
                <span>{link.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </a>
            ))}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[var(--text-main)] transition-colors text-[12px]"
                title="Live"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={13} />
                <span>{project.liveLink.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Detailed view: features, responsibilities, tech stack */}
      {isDetailed && (
        <div className="mt-5 flex flex-col gap-4">
          {project.features && project.features.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[13px] font-semibold text-[var(--text-main)]">Features</h4>
              <ul className="list-disc list-outside ml-4 text-[13px] text-muted space-y-1">
                {project.features.map((feat, i) => (
                  <li key={i} className="leading-relaxed">{feat}</li>
                ))}
              </ul>
            </div>
          )}
          {project.responsibilities && project.responsibilities.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-[13px] font-semibold text-[var(--text-main)]">Responsibilities</h4>
              <ul className="list-disc list-outside ml-4 text-[13px] text-muted space-y-1">
                {project.responsibilities.map((resp, i) => (
                  <li key={i} className="leading-relaxed">{resp}</li>
                ))}
              </ul>
            </div>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-col gap-2 mt-2">
              <h4 className="text-[13px] font-semibold text-[var(--text-main)]">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => {
                  const svg = getTechSvg(tech);
                  return (
                    <div key={tech} className="flex items-center justify-center gap-0 hover:gap-2 neo-box-inset !rounded-full p-2 hover:px-4 text-[11px] font-medium text-muted hover:text-[var(--text-main)] transition-all duration-500 ease-out cursor-default group overflow-hidden" title={tech}>
                      {svg && <span className="w-4 h-4 shrink-0 inline-flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svg }} />}
                      <span className={`transition-all duration-500 ease-out whitespace-nowrap overflow-hidden font-semibold ${svg ? 'max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100' : ''}`}>{tech}</span>
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

export default ProjectCard;
