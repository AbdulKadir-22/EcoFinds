const express = require('express');
const router = express.Router();

// Middleware
const requireAuth = require('../middlewares/requireAuth');

// Controller functions
// Import the new updateProfile function
const { loginUser, signupUser, getProfile, updateProfile } = require('../controllers/userAuth.controller');

// --- Public Routes ---
router.post('/login', loginUser);
router.post('/signup', signupUser);

// --- Protected Routes (require authentication) ---
// The requireAuth middleware will run before these controller functions
router.get('/profile', requireAuth, getProfile);

// Added a new route for updating the user profile
router.patch('/profile', requireAuth, updateProfile);

module.exports = router;
