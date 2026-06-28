import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProjects } from '../../../store/dataSlice';
import TechMultiSelect from '../TechMultiSelect';

const ProjectFormModal = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const isEdit = !!initialData;
  
  const [formData, setFormData] = useState({
    title: '', type: '', description: '', githubLink: '', liveLink: '',
    startDate: '', endDate: '',
    technologies: [], features: '', responsibilities: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          type: initialData.type || '',
          description: initialData.description || '',
          githubLink: Array.isArray(initialData.githubLink) 
            ? initialData.githubLink.join('\n') 
            : (initialData.githubLink || ''),
          liveLink: initialData.liveLink || '',
          startDate: initialData.startDate || '',
          endDate: initialData.endDate || '',
          technologies: initialData.technologies || [],
          features: initialData.features?.join('\n') || '',
          responsibilities: initialData.responsibilities?.join('\n') || ''
        });
      } else {
        setFormData({ title: '', type: '', description: '', githubLink: '', liveLink: '', startDate: '', endDate: '', technologies: [], features: '', responsibilities: '' });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      githubLink: formData.githubLink.split('\n').map(l => l.trim()).filter(Boolean),
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
      responsibilities: formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean)
    };

    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/project/newProject`;
      let method = 'POST';

      if (isEdit) {
        const projId = initialData._id || initialData.id;
        url = `${import.meta.env.VITE_BACKEND_URL}/project/previousEdit/${projId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Save failed');
      }

      dispatch(fetchProjects());
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neo-box p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-bold mb-6">{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
        
        {error && <div className="text-red-500 text-[12px] mb-4 neo-box-inset p-2">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" required>
                <option value="">Select type...</option>
                <option value="Personal">Personal</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[12px] text-muted ml-1">GitHub Links (one per line) *</label>
              <textarea name="githubLink" value={formData.githubLink} onChange={handleChange} rows={2} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none leading-relaxed" required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[12px] text-muted ml-1">Live Link</label>
              <input name="liveLink" value={formData.liveLink} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Start Date</label>
              <input type="month" name="startDate" value={formData.startDate} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">End Date</label>
              <input type="month" name="endDate" value={formData.endDate} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[12px] text-muted ml-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none leading-relaxed" />
          </div>

          <div className="flex flex-col gap-1 mt-2 z-10">
            <TechMultiSelect 
              selectedTechs={formData.technologies} 
              onChange={(techs) => setFormData({ ...formData, technologies: techs })} 
            />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[12px] text-muted ml-1">Features (one per line)</label>
            <textarea name="features" value={formData.features} onChange={handleChange} rows={3} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none leading-relaxed" />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[12px] text-muted ml-1">Responsibilities (one per line)</label>
            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={3} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none leading-relaxed" />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="neo-button flex-1" disabled={loading}>Cancel</button>
            <button type="submit" className="neo-button flex-1 bg-[var(--text-main)] text-[var(--bg-color)] font-bold border-transparent" disabled={loading}>
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
