const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { submitInquiry, getInquiries, updateInquiryStatus, deleteInquiry } = require('../controllers/hireController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Specific rate limiter for hire inquiries to prevent spam (e.g., 5 per 15 minutes)
const hireLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 5, 
  standardHeaders: true, 
  legacyHeaders: false,
  message: { success: false, message: "Too many inquiries from this IP, please try again after 15 minutes." }
});

// Public route to submit an inquiry
router.post('/submit', hireLimiter, submitInquiry);

// Protected Admin routes
router.get('/', verifyAdmin, getInquiries);
router.put('/:id', verifyAdmin, updateInquiryStatus);
router.delete('/:id', verifyAdmin, deleteInquiry);

module.exports = router;
