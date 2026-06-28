const Blog = require('../models/blog');
const Profile = require('../models/profile');
const bcrypt = require('bcryptjs');

exports.getBlog = async (req, res) => {
    try {
        const blogs = await Blog.find();
        const clientIP = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        
        const formattedBlogs = blogs.map(blog => ({
            id: blog._id,
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            likes: blog.likes,
            liked: blog.likedIPs.includes(clientIP),
            links: blog.links,
            createdAt: blog.createdAt
        }));

        res.status(200).json({ blogs: formattedBlogs });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
};

exports.getBlogId = async (req, res) => {
    try {
        const blogs = await Blog.find().select('_id');
        const ids = blogs.map(b => b._id);
        res.status(200).json({ ids });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog IDs", error: error.message });
    }
};

exports.newBlog = async (req, res) => {
    try {
        const { title, content, tags, links } = req.body;

        if (!title || !content) {
             return res.status(400).json({ message: "Required fields missing (title, content)" });
        }
        
        const newBlog = new Blog({
            title,
            content,
            tags: tags || [],
            links: links || []
        });

        await newBlog.save();

        res.status(201).json({ message: "Blog added successfully", blog: newBlog });
    } catch (error) {
        res.status(500).json({ message: "Error adding blog", error: error.message });
    }
};

exports.previousEdit = async (req, res) => {
    try {
        const { blogId } = req.params;
        const updateData = req.body;
        
        if (!updateData.title || !updateData.content) {
             return res.status(400).json({ message: "Required fields missing for update (title, content)" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { ...updateData },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(500).json({ message: "Error updating blog", error: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Admin password is required to delete blog" });
        }

        // Verify admin password
        const adminProfile = await Profile.findById(req.user._id);
        if (!adminProfile) {
            return res.status(404).json({ message: "Admin profile not found" });
        }

        const isMatch = await bcrypt.compare(password, adminProfile.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect admin password" });
        }

        const deletedBlog = await Blog.findByIdAndDelete(blogId);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog deleted successfully", blog: deletedBlog });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { blogId } = req.params;
        const clientIP = req.ip || req.headers['x-forwarded-for'] || 'unknown';

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const alreadyLiked = blog.likedIPs.includes(clientIP);

        if (alreadyLiked) {
            // Unlike
            blog.likedIPs = blog.likedIPs.filter(ip => ip !== clientIP);
            blog.likes = Math.max(0, blog.likes - 1);
        } else {
            // Like
            blog.likedIPs.push(clientIP);
            blog.likes += 1;
        }

        await blog.save();

        res.status(200).json({ 
            likes: blog.likes, 
            liked: !alreadyLiked 
        });
    } catch (error) {
        res.status(500).json({ message: "Error toggling like", error: error.message });
    }
};
