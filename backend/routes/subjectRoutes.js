const express = require('express');
const router = express.Router();
const { createSubject, getSubjects } = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createSubject);
router.get('/', protect, getSubjects);

module.exports = router; 