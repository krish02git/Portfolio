import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogCard from '../components/BlogCard';
import { fetchBlogs } from '../store/dataSlice';

const Blog = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.data.blogs);
  const blogStatus = useSelector(state => state.data.blogStatus);

  useEffect(() => {
    if (blogStatus === 'idle') dispatch(fetchBlogs());
  }, [blogStatus, dispatch]);

  return (
    <div className="flex flex-col pb-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-0.5">Blog</h1>
        <p className="text-[13px] text-muted">Thoughts, tutorials, and insights on modern web technologies.</p>
      </div>
      <div className="flex flex-col">
        {blogStatus === 'loading' ? (
          <p className="text-muted">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-muted">No blogs found.</p>
        ) : (
          blogs.map(blog => (
            <BlogCard key={blog._id || blog.id} blog={blog} />
          ))
        )}
      </div>
    </div>
  );
};

export default Blog;
