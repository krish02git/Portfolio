import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../../store/dataSlice';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import ProjectFormModal from './modals/ProjectFormModal';

const AdminProjectPanel = () => {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.data.projects);
  const projectStatus = useSelector(state => state.data.projectStatus);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    if (projectStatus === 'idle') dispatch(fetchProjects());
  }, [projectStatus, dispatch]);

  const handleDeleteClick = (proj) => {
    setItemToDelete(proj);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (proj) => {
    setItemToEdit(proj);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = async (password) => {
    const projId = itemToDelete._id || itemToDelete.id;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/deleteProject/${projId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Deletion failed');
    }

    dispatch(fetchProjects());
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Manage Projects</h2>
        <button onClick={handleAddNew} className="neo-button text-sm text-green-500 border-green-500/20">
          + Add New Project
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {projectStatus === 'loading' && <p className="text-muted">Loading...</p>}
        {projects.map(proj => (
          <div key={proj._id || proj.id} className="neo-box p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[15px]">{proj.title}</h3>
              <p className="text-[12px] text-muted mt-1">{proj.type}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEditClick(proj)} className="neo-button-sm text-blue-500 border-blue-500/20">Edit</button>
              <button onClick={() => handleDeleteClick(proj)} className="neo-button-sm text-red-500 border-red-500/20">Delete</button>
            </div>
          </div>
        ))}
        {projectStatus === 'succeeded' && projects.length === 0 && (
          <div className="neo-box-inset p-8 text-center text-muted text-sm">No projects found. Add one above!</div>
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title || 'this project'}
      />

      <ProjectFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={itemToEdit}
      />
    </div>
  );
};

export default AdminProjectPanel;
