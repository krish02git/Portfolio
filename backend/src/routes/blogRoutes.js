const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getBlog, getBlogId, newBlog, previousEdit, deleteBlog, toggleLike } = require('../controllers/blogController');
const { verifyAdmin } = require('../middleware/authMiddleware');

const likeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // max 20 like toggles per 15 min per IP
  message: { message: "Too many like requests. Please slow down." }
});

router.get('/getBlog', getBlog);
router.get('/getBlogId', verifyAdmin, getBlogId);
router.post('/newBlog', verifyAdmin, newBlog);
router.post('/like/:blogId', likeLimiter, toggleLike);
router.put('/previousEdit/:blogId', verifyAdmin, previousEdit);
router.delete('/deleteBlog/:blogId', verifyAdmin, deleteBlog);

module.exports = router;
