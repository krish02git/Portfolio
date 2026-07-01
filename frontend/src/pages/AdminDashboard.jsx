import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../store/authSlice';
import AdminWorkPanel from '../components/admin/AdminWorkPanel';
import AdminProjectPanel from '../components/admin/AdminProjectPanel';
import AdminBlogPanel from '../components/admin/AdminBlogPanel';

const AdminDashboard = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('work');
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, { 
        method: 'POST',
        credentials: 'include',
      });
      dispatch(setAuthenticated(false));
      navigate('/admin');
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-col pb-10">
      <div className="flex justify-between items-center mb-6 border-b border-black dark:border-white pb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="neo-button-sm text-red-500 border-red-500/20 bg-red-500/10">
          Logout
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-black dark:border-white pb-2">
        <button onClick={scrollLeft} className="neo-button-sm p-1.5 shrink-0" title="Scroll Left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar flex-1 scroll-smooth">
          <button 
            onClick={() => setActiveTab('work')}
            className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${activeTab === 'work' ? 'font-bold text-[var(--text-main)] border-b-2 border-gray-400' : 'text-muted hover:text-[var(--text-main)]'}`}
          >
            Manage Work
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'font-bold text-[var(--text-main)] border-b-2 border-gray-400' : 'text-muted hover:text-[var(--text-main)]'}`}
          >
            Manage Projects
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${activeTab === 'blogs' ? 'font-bold text-[var(--text-main)] border-b-2 border-gray-400' : 'text-muted hover:text-[var(--text-main)]'}`}
          >
            Manage Blogs
          </button>
        </div>
        <button onClick={scrollRight} className="neo-button-sm p-1.5 shrink-0" title="Scroll Right">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div>
        {activeTab === 'work' && <AdminWorkPanel />}
        {activeTab === 'projects' && <AdminProjectPanel />}
        {activeTab === 'blogs' && <AdminBlogPanel />}
      </div>
    </div>
  );
};

export default AdminDashboard;
