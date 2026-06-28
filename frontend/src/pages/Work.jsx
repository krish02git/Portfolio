import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExperienceCard from '../components/ExperienceCard';
import { fetchWork } from '../store/dataSlice';

const Work = () => {
  const dispatch = useDispatch();
  const experiences = useSelector(state => state.data.experiences);
  const workStatus = useSelector(state => state.data.workStatus);

  useEffect(() => {
    if (workStatus === 'idle') dispatch(fetchWork());
  }, [workStatus, dispatch]);

  return (
    <div className="flex flex-col pb-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-0.5">Work Experience</h1>
        <p className="text-[13px] text-muted">My professional journey, building scalable systems and impactful products.</p>
      </div>
      <div className="flex flex-col">
        {workStatus === 'loading' ? (
          <p className="text-muted">Loading...</p>
        ) : experiences.length === 0 ? (
          <p className="text-muted">No experience found.</p>
        ) : (
          experiences.map(exp => (
            <ExperienceCard key={exp._id || exp.id} experience={exp} detailed={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default Work;
