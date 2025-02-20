const Attendance = require('../models/Attendance');
const Class = require('../models/Class');

const markAttendance = async (req, res) => {
  try {
    const { attendanceRecords } = req.body;
    
    if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
      return res.status(400).json({ message: 'Invalid attendance data' });
    }

    // Validate each record has required fields
    for (const record of attendanceRecords) {
      if (!record.student || !record.class || !record.status || !record.date) {
        return res.status(400).json({ 
          message: 'Each attendance record must have student, class, status, and date' 
        });
      }
    }

    // Create all attendance records
    const createdRecords = await Attendance.insertMany(attendanceRecords);

    // Populate student and class details in the response
    const populatedRecords = await Attendance.find({
      _id: { $in: createdRecords.map(record => record._id) }
    })
    .populate('student', 'name')
    .populate('class', 'name subject');

    res.status(201).json(populatedRecords);
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ 
      message: 'Failed to mark attendance', 
      error: error.message 
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { user } = req;
    let query = {};

    // If student, get only their attendance
    if (user.role === 'student') {
      query.student = user._id;
    }
    // If teacher, get attendance for their classes
    else if (user.role === 'teacher') {
      const classes = await Class.find({ teacher: user._id });
      query.class = { $in: classes.map(c => c._id) };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name')
      .populate('class', 'name subject')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch attendance', 
      error: error.message 
    });
  }
};

module.exports = { markAttendance, getAttendance }; 