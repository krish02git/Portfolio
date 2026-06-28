import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchBlogs } from '../../../store/dataSlice';

const BlogFormModal = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const isEdit = !!initialData;
  
  const [formData, setFormData] = useState({
    title: '', content: '', tags: '', links: '', likes: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          content: initialData.content || '',
          tags: initialData.tags?.join(', ') || '',
          links: initialData.links?.join('\n') || '',
          likes: initialData.likes || 0
        });
      } else {
        setFormData({ title: '', content: '', tags: '', links: '', likes: 0 });
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
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      links: formData.links.split('\n').map(l => l.trim()).filter(Boolean),
      likes: Number(formData.likes) || 0
    };

    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/blog/newBlog`;
      let method = 'POST';

      if (isEdit) {
        const blogId = initialData._id || initialData.id;
        url = `${import.meta.env.VITE_BACKEND_URL}/blog/previousEdit/${blogId}`;
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

      dispatch(fetchBlogs());
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
        <h2 className="text-xl font-bold mb-6">{isEdit ? 'Edit Blog' : 'Add New Blog'}</h2>
        
        {error && <div className="text-red-500 text-[12px] mb-4 neo-box-inset p-2">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] text-muted ml-1">Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" required />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[12px] text-muted ml-1">Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows={6} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none leading-relaxed" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Tags (comma separated)</label>
              <input name="tags" value={formData.tags} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-muted ml-1">Likes</label>
              <input type="number" name="likes" value={formData.likes} onChange={handleChange} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[12px] text-muted ml-1">Links (one per line)</label>
            <textarea name="links" value={formData.links} onChange={handleChange} rows={2} className="neo-box-inset p-3 text-[14px] bg-transparent outline-none leading-relaxed" />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} className="neo-button flex-1" disabled={loading}>Cancel</button>
            <button type="submit" className="neo-button flex-1 bg-[var(--text-main)] text-[var(--bg-color)] font-bold border-transparent" disabled={loading}>
              {loading ? 'Saving...' : 'Save Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
