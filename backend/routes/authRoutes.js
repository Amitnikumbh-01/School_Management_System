const express = require('express');
const router = express.Router();
const { registerUser, loginUser, assignClass } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Assign class route (protected)
router.post('/assign-class', protect, assignClass);

module.exports = router; 