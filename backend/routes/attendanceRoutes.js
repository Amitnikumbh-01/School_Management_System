const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance } = require('../controllers/attendanceController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.post('/', protect, teacher, markAttendance);
router.get('/', protect, getAttendance);

module.exports = router; 