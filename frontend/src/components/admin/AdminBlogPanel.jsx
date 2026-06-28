import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../../store/dataSlice';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import BlogFormModal from './modals/BlogFormModal';

const AdminBlogPanel = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.data.blogs);
  const blogStatus = useSelector(state => state.data.blogStatus);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    if (blogStatus === 'idle') dispatch(fetchBlogs());
  }, [blogStatus, dispatch]);

  const handleDeleteClick = (blog) => {
    setItemToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (blog) => {
    setItemToEdit(blog);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsFormOpen(true);
  };

  const confirmDelete = async (password) => {
    const blogId = itemToDelete._id || itemToDelete.id;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blog/deleteBlog/${blogId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Deletion failed');
    }

    dispatch(fetchBlogs());
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Manage Blogs</h2>
        <button onClick={handleAddNew} className="neo-button text-sm text-green-500 border-green-500/20">
          + Add New Blog
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {blogStatus === 'loading' && <p className="text-muted">Loading...</p>}
        {blogs.map(blog => (
          <div key={blog._id || blog.id} className="neo-box p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[15px]">{blog.title}</h3>
              <p className="text-[12px] text-muted mt-1">❤️ {blog.likes || 0}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEditClick(blog)} className="neo-button-sm text-blue-500 border-blue-500/20">Edit</button>
              <button onClick={() => handleDeleteClick(blog)} className="neo-button-sm text-red-500 border-red-500/20">Delete</button>
            </div>
          </div>
        ))}
        {blogStatus === 'succeeded' && blogs.length === 0 && (
          <div className="neo-box-inset p-8 text-center text-muted text-sm">No blogs found. Add one above!</div>
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.title || 'this blog'}
      />

      <BlogFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={itemToEdit}
      />
    </div>
  );
};

export default AdminBlogPanel;
