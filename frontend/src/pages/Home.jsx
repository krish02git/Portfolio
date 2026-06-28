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

  return (
    <div className="flex flex-col gap-6 pb-6">
      <PersonalDetails />

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
