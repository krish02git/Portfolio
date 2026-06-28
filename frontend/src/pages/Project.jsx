import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProjectCard from '../components/ProjectCard';
import { fetchProjects } from '../store/dataSlice';

const Project = () => {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.data.projects);
  const projectStatus = useSelector(state => state.data.projectStatus);

  useEffect(() => {
    if (projectStatus === 'idle') dispatch(fetchProjects());
  }, [projectStatus, dispatch]);

  return (
    <div className="flex flex-col pb-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-0.5">Projects</h1>
        <p className="text-[13px] text-muted">Open-source builds, side projects, and creative experiments.</p>
      </div>
      <div className="flex flex-col">
        {projectStatus === 'loading' ? (
          <p className="text-muted">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-muted">No projects found.</p>
        ) : (
          projects.map(proj => (
            <ProjectCard key={proj._id || proj.id} project={proj} detailed={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default Project;
