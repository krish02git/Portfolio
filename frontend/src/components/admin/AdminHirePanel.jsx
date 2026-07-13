import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Trash2, Mail, ExternalLink, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

const AdminHirePanel = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/hire`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setInquiries(data.data);
      } else {
        setError(data.message || 'Failed to fetch inquiries');
      }
    } catch (err) {
      setError('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleReadStatus = async (id, currentStatus, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/hire/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus }),
        credentials: 'include',
      });

      if (response.ok) {
        setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, isRead: !currentStatus } : inq));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const deleteInquiry = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/hire/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setInquiries(inquiries.filter(inq => inq._id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch (err) {
      console.error('Failed to delete inquiry', err);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  if (error) return <div className="text-red-500 p-4 neo-box !rounded-lg bg-red-500/10 border-red-500/20">{error}</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Manage Hire Inquiries</h2>
      </div>
      
      {inquiries.length === 0 ? (
        <div className="text-center p-10 neo-box-inset !rounded-lg text-muted text-sm">
          No inquiries yet. They will appear here when someone contacts you.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inq) => {
            const isExpanded = expandedId === inq._id;
            
            return (
              <div 
                key={inq._id} 
                className={`neo-box !rounded-lg transition-all duration-300 overflow-hidden ${inq.isRead ? 'opacity-80 bg-black/5 dark:bg-white/5' : 'border-[var(--accent)]'}`}
              >
                {/* Summary Row (Clickable) */}
                <div 
                  onClick={() => toggleExpand(inq._id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[15px]">{inq.name}</h3>
                    {!inq.isRead && (
                      <span className="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse">
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-muted text-xs">
                    <span className="hidden sm:inline-block">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-black/10 dark:border-white/10 flex flex-col gap-4 bg-white/30 dark:bg-black/20">
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                      {inq.company && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" /> {inq.company}
                        </span>
                      )}
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-[var(--text-main)] transition-colors">
                        <Mail className="w-4 h-4" /> {inq.email}
                      </a>
                    </div>
                    
                    <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg text-sm text-[var(--text-main)] leading-relaxed">
                      <p className="whitespace-pre-wrap">{inq.message}</p>
                    </div>

                    {inq.budget && (
                      <div className="flex flex-wrap gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-md">
                          <DollarSign className="w-3 h-3" /> Budget in Rupees: {inq.budget}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 mt-2">
                      <button 
                        onClick={(e) => toggleReadStatus(inq._id, inq.isRead, e)}
                        className={`neo-button-sm flex justify-center items-center gap-2 ${inq.isRead ? 'bg-gray-500/20' : 'bg-green-500/20 text-green-600 dark:text-green-400'}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        {inq.isRead ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button 
                        onClick={(e) => deleteInquiry(inq._id, e)}
                        className="neo-button-sm flex justify-center items-center gap-2 bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                    
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminHirePanel;
