import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';

const HireModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    budget: '',
  });
  
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/hire/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ loading: false, error: null, success: true });
        setTimeout(() => {
          onClose();
          setStatus({ loading: false, error: null, success: false });
          setFormData({ name: '', email: '', company: '', message: '', budget: '' });
        }, 3000);
      } else {
        setStatus({ loading: false, error: data.message || 'Failed to submit inquiry.', success: false });
      }
    } catch (err) {
      setStatus({ loading: false, error: 'Network error. Please try again later.', success: false });
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto neo-box !rounded-xl bg-[var(--bg-main)] p-6 md:p-8 custom-scrollbar shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Let's Work Together</h2>

        {status.success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
            <p className="text-muted">Thanks for reaching out. I'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold">Who's contacting? <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Krish"
                className="neo-input w-full p-2.5 text-sm !rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold">To reply back <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="email"
                className="neo-input w-full p-2.5 text-sm !rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-sm font-semibold">Company / Organization <span className="text-muted font-normal">(Optional)</span></label>
              <input 
                type="text" 
                id="company" 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Your company name"
                className="neo-input w-full p-2.5 text-sm !rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-semibold">Message / Project Details <span className="text-red-500">*</span></label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                rows={4}
                placeholder="Project details"
                className="neo-input w-full p-2.5 text-sm !rounded-lg resize-y min-h-[100px]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="budget" className="text-sm font-semibold">Budget <span className="text-muted font-normal">(Optional)</span></label>
              <input 
                type="text" 
                id="budget" 
                name="budget" 
                value={formData.budget} 
                onChange={handleChange} 
                placeholder="In Rupees (₹)"
                className="neo-input w-full p-2.5 text-sm !rounded-lg"
              />
            </div>

            {status.error && (
              <div className="p-3 rounded-lg border border-red-500/50 bg-red-500/10 text-red-500 text-sm font-medium text-center">
                {status.error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status.loading}
              className="mt-2 neo-button w-full p-3 font-bold flex items-center justify-center gap-2"
            >
              {status.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message'}
            </button>
            
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default HireModal;
