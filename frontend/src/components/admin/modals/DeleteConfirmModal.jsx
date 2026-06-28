import { useState } from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsDeleting(true);

    try {
      await onConfirm(password);
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Deletion failed. Invalid password?');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="neo-box p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2 text-red-500">Confirm Deletion</h2>
        <p className="text-[13px] text-muted mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-[var(--text-main)]">"{itemName}"</span>?
          This requires your admin password.
        </p>

        {error && <div className="text-red-500 text-[12px] mb-4 text-center neo-box-inset p-2">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="neo-box-inset p-3 bg-transparent outline-none w-full text-[14px]"
            required
          />
          <div className="flex gap-4 mt-2">
            <button 
              type="button" 
              onClick={() => {
                setPassword('');
                setError('');
                onClose();
              }} 
              className="neo-button flex-1"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="neo-button flex-1 text-red-500 border-red-500/20"
              disabled={isDeleting || !password}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
