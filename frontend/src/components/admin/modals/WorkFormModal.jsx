import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchWork } from '../../../store/dataSlice';
import TechMultiSelect from '../TechMultiSelect';

const WorkFormModal = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const isEdit = !!initialData;
  
  const [formData, setFormData] = useState({
    company: '',
    jobType: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    technologies: [], 
    responsibilities: ''
  });

  const [isCurrent, setIsCurrent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          company: initialData.company || '',
          jobType: initialData.jobType || '',
          role: initialData.role || '',
          startDate: initialData.startDate || '',
          endDate: initialData.endDate || '',
          location: initialData.location || '',
          technologies: initialData.technologies || [],
          responsibilities: initialData.responsibilities?.join('\n') || ''
        });
        setIsCurrent(initialData.endDate === 'Present');
      } else {
        setFormData({
          company: '', jobType: '', role: '', startDate: '', endDate: '', location: '', technologies: [], responsibilities: ''
        });
        setIsCurrent(false);
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrentChange = (e) => {
    setIsCurrent(e.target.checked);
    if (e.target.checked) {
      setFormData({ ...formData, endDate: 'Present' });
    } else {
      setFormData({ ...formData, endDate: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      responsibilities: formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean)
    };

    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/work/newWork`;
      let method = 'POST';

      if (isEdit) {
        const expId = initialData._id || initialData.id;
        url = `${import.meta.env.VITE_BACKEND_URL}/work/previousEdit/${expId}`;
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

      dispatch(fetchWork());
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
        <h2 className="text-xl font-bold mb-6">{isEdit ? 'Edit Work Experience' : 'Add New Work'}</h2>
        
        {error && <div className="text-red-500 text-[12px] mb-4 neo-box-inset p-2">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Company *</label>
              <input name="company" value={formData.company} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none [&>option]:bg-[#f0f0f3] dark:[&>option]:bg-[#121212]">
                <option value="">Select Type</option>
                <option value="Internship">Internship</option>
                <option value="Job">Job</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Role *</label>
              <input name="role" value={formData.role} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Location</label>
              <input name="location" value={formData.location} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Start Date</label>
              <input type="month" name="startDate" value={formData.startDate} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[12px] text-muted">End Date</label>
                <label className="flex items-center gap-1 text-[12px] text-muted cursor-pointer">
                  <input type="checkbox" checked={isCurrent} onChange={handleCurrentChange} className="accent-[var(--text-main)]" />
                  Current
                </label>
              </div>
              <input 
                type={isCurrent ? "text" : "month"} 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange} 
                disabled={isCurrent}
                placeholder={isCurrent ? "Present" : ""}
                className={`neo-box-inset p-3 text-[14px] bg-transparent outline-none ${isCurrent ? 'opacity-50 cursor-not-allowed text-[var(--text-main)] font-semibold' : ''}`} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2 z-10">
            <TechMultiSelect 
              selectedTechs={formData.technologies} 
              onChange={(techs) => setFormData({ ...formData, technologies: techs })} 
            />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[12px] text-muted ml-1">Responsibilities (one per line)</label>
            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} rows={4} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none leading-relaxed" />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="neo-button flex-1" disabled={loading}>Cancel</button>
            <button type="submit" className="neo-button flex-1 bg-[var(--text-main)] text-[var(--bg-color)] font-bold border-transparent" disabled={loading}>
              {loading ? 'Saving...' : 'Save Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkFormModal;
