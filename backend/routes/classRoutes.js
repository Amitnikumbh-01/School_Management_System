const express = require('express');
const router = express.Router();
const { protect, teacher } = require('../middleware/authMiddleware');
const { 
  createClass, 
  getClasses, 
  addStudentToClass,
  removeStudentFromClass,
  updateClass, 
  deleteClass 
} = require('../controllers/classController');

// Apply protect middleware to all routes
router.use(protect);

// Routes that require teacher role
router.route('/')
  .get(getClasses)
  .post(teacher, createClass);

router.route('/:id')
  .put(teacher, updateClass)
  .delete(teacher, deleteClass);

// Add these new routes for managing students
router.route('/:id/students')
  .post(teacher, addStudentToClass);

router.route('/:id/students/:studentId')
  .delete(teacher, removeStudentFromClass);

module.exports = router; 