const express = require('express');
const router = express.Router();
const { protect, teacher } = require('../middleware/authMiddleware');
const {
  createAssignment,
  getAssignments,
  getAssignmentsByClass,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
} = require('../controllers/assignmentController');

// Public routes
router.get('/', protect, getAssignments);
router.get('/class/:classId', protect, getAssignmentsByClass);

// Teacher only routes
router.post('/', protect, teacher, createAssignment);
router.put('/:id', protect, teacher, updateAssignment);
router.delete('/:id', protect, teacher, deleteAssignment);

// Student routes
router.post('/:id/submit', protect, submitAssignment);

module.exports = router; 