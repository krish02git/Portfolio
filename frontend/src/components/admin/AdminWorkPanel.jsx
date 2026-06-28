import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWork } from '../../store/dataSlice';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import WorkFormModal from './modals/WorkFormModal';

const AdminWorkPanel = () => {
  const dispatch = useDispatch();
  const experiences = useSelector(state => state.data.experiences);
  const workStatus = useSelector(state => state.data.workStatus);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    if (workStatus === 'idle') dispatch(fetchWork());
  }, [workStatus, dispatch]);

  const handleDeleteClick = (exp) => {
    setItemToDelete(exp);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (exp) => {
    setItemToEdit(exp);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = async (password) => {
    const expId = itemToDelete._id || itemToDelete.id;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/work/deleteWork/${expId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Deletion failed');
    }

    dispatch(fetchWork());
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Manage Work Experience</h2>
        <button onClick={handleAddNew} className="neo-button text-sm text-green-500 border-green-500/20">
          + Add New Work
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {workStatus === 'loading' && <p className="text-muted">Loading...</p>}
        {experiences.map(exp => (
          <div key={exp._id || exp.id} className="neo-box p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[15px]">{exp.company}</h3>
              <p className="text-[12px] text-muted mt-1">{exp.role}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEditClick(exp)} className="neo-button-sm text-blue-500 border-blue-500/20">Edit</button>
              <button onClick={() => handleDeleteClick(exp)} className="neo-button-sm text-red-500 border-red-500/20">Delete</button>
            </div>
          </div>
        ))}
        {workStatus === 'succeeded' && experiences.length === 0 && (
          <div className="neo-box-inset p-8 text-center text-muted text-sm">No work experience entries found. Add one above!</div>
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.company || 'this item'}
      />

      <WorkFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={itemToEdit}
      />
    </div>
  );
};

export default AdminWorkPanel;
