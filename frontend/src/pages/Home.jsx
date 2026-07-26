import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PersonalDetails from '../components/PersonalDetails';
import ExperienceCard from '../components/ExperienceCard';
import ProjectCard from '../components/ProjectCard';
import BlogCard from '../components/BlogCard';
import { fetchWork, fetchProjects, fetchBlogs } from '../store/dataSlice';

const Home = () => {
  const dispatch = useDispatch();

  const experiences = useSelector(state => state.data.experiences);
  const projects = useSelector(state => state.data.projects);
  const blogs = useSelector(state => state.data.blogs);

  const workStatus = useSelector(state => state.data.workStatus);
  const projectStatus = useSelector(state => state.data.projectStatus);
  const blogStatus = useSelector(state => state.data.blogStatus);

  useEffect(() => {
    if (workStatus === 'idle') dispatch(fetchWork());
    if (projectStatus === 'idle') dispatch(fetchProjects());
    if (blogStatus === 'idle') dispatch(fetchBlogs());
  }, [workStatus, projectStatus, blogStatus, dispatch]);

  const topExperiences = experiences.slice(0, 2);
  const topProjects = projects.slice(0, 2);
  const topBlogs = blogs.slice(0, 2);

  const workLinks = experiences
    .filter(exp => exp.websiteLink)
    .slice(0, 3)
    .map(exp => ({ label: exp.company, url: exp.websiteLink }));

  const liveLinks = projects
    .filter(proj => proj.liveLink)
    .slice(0, 3)
    .map(proj => ({ label: proj.title, url: proj.liveLink }));

  const hasLinks = workLinks.length > 0 || liveLinks.length > 0;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <PersonalDetails />

      {/* Website links (work) & Live links (projects) — only shown when data exists */}
      {hasLinks && (
        <div className="flex flex-wrap gap-2 -mt-3">
          {workLinks.map((item, i) => (
            <a
              key={`work-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 neo-button-sm !rounded-full px-3 py-1.5 text-[12px] font-medium text-muted hover:text-[var(--text-main)] transition-all duration-300"
              title={`${item.label} website`}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>{item.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
            </a>
          ))}
          {liveLinks.map((item, i) => (
            <a
              key={`live-${i}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 neo-button-sm !rounded-full px-3 py-1.5 text-[12px] font-medium text-muted hover:text-[var(--text-main)] transition-all duration-300"
              title={`${item.label} live`}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              <span>{item.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</span>
            </a>
          ))}
        </div>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Experience</h2>
        <div className="flex flex-col">
          {workStatus === 'loading' && <p className="text-muted text-sm">Loading...</p>}
          {topExperiences.map(exp => (
            <ExperienceCard key={exp._id || exp.id} experience={exp} isHome={true} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/work" className="neo-button text-sm w-full md:w-auto">
            Show all work experiences
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Personal Open Source Projects</h2>
        <div className="flex flex-col">
          {projectStatus === 'loading' && <p className="text-muted text-sm">Loading...</p>}
          {topProjects.map(proj => (
            <ProjectCard key={proj._id || proj.id} project={proj} isHome={true} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/project" className="neo-button text-sm w-full md:w-auto">
            Show all projects
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Blog</h2>
        <div className="flex flex-col">
          {blogStatus === 'loading' && <p className="text-muted text-sm">Loading...</p>}
          {blogStatus !== 'loading' && topBlogs.length === 0 ? (
            <p className="text-muted text-sm my-2">No Blog Yet</p>
          ) : (
            topBlogs.map(blog => (
              <BlogCard key={blog._id || blog.id} blog={blog} isHome={true} />
            ))
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/blog" className="neo-button text-sm w-full md:w-auto">
            Show all blogs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
