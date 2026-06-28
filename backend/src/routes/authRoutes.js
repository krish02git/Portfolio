const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, logout } = require('../controllers/authController');

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  limit: 10, // start blocking after 10 requests
  message: { message: "Too many login attempts from this IP, please try again after an hour." }
});

// @route POST /api/auth/login
router.post('/login', loginLimiter, login);

// @route POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;
