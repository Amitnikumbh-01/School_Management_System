const Class = require('../models/Class');
const User = require('../models/User');

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private (Teacher only)
const createClass = async (req, res) => {
  try {
    const { name, subject, description, schedule } = req.body;

    const newClass = await Class.create({
      name,
      subject,
      description,
      schedule,
      teacher: req.user._id,
      students: [],
    });

    // Populate teacher details before sending response
    const populatedClass = await Class.findById(newClass._id)
      .populate('teacher', 'name')
      .populate('students', 'name');

    res.status(201).json(populatedClass);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get classes based on user role
// @route   GET /api/classes
// @access  Private
const getClasses = async (req, res) => {
  try {
    let classes;
    if (req.user.role === 'teacher') {
      classes = await Class.find({ teacher: req.user._id })
        .populate('teacher', 'name')
        .populate('students', 'name')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'student') {
      classes = await Class.find({ students: req.user._id })
        .populate('teacher', 'name')
        .populate('students', 'name')
        .sort({ createdAt: -1 });
    }
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add student to class
// @route   POST /api/classes/:id/students
// @access  Private/Teacher
const addStudentToClass = async (req, res) => {
  try {
    const { email } = req.body;
    const classId = req.params.id;

    // Find the student by email
    const student = await User.findOne({ email, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the class and check if teacher is authorized
    const classToUpdate = await Class.findById(classId);
    if (!classToUpdate) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if teacher owns this class
    if (classToUpdate.teacher.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this class' });
    }

    // Check if student is already in class
    if (classToUpdate.students.includes(student._id)) {
      return res.status(400).json({ message: 'Student already enrolled in this class' });
    }

    // Add student to class
    classToUpdate.students.push(student._id);
    await classToUpdate.save();

    // Populate the response with student details
    const updatedClass = await Class.findById(classId)
      .populate('students', 'name email')
      .populate('teacher', 'name email');

    res.json(updatedClass);
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ message: 'Failed to add student to class' });
  }
};

// @desc    Remove student from class
// @route   DELETE /api/classes/:id/students/:studentId
// @access  Private/Teacher
const removeStudentFromClass = async (req, res) => {
  try {
    const { id: classId, studentId } = req.params;

    // Find the class and check if teacher is authorized
    const classToUpdate = await Class.findById(classId);
    if (!classToUpdate) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if teacher owns this class
    if (classToUpdate.teacher.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to modify this class' });
    }

    // Remove student from class
    classToUpdate.students = classToUpdate.students.filter(
      student => student.toString() !== studentId
    );
    await classToUpdate.save();

    // Populate the response with student details
    const updatedClass = await Class.findById(classId)
      .populate('students', 'name email')
      .populate('teacher', 'name email');

    res.json(updatedClass);
  } catch (error) {
    console.error('Remove student error:', error);
    res.status(500).json({ message: 'Failed to remove student from class' });
  }
};

// Add this method to handle class updates
const updateClass = async (req, res) => {
  try {
    const { name, subject, description, schedule } = req.body;
    const classId = req.params.id;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { name, subject, description, schedule },
      { new: true }
    )
    .populate('teacher', 'name')
    .populate('students', 'name');

    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(updatedClass);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add this method to handle class deletion
const deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const deletedClass = await Class.findByIdAndDelete(classId);
    
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createClass, 
  getClasses, 
  addStudentToClass,
  removeStudentFromClass,
  updateClass, 
  deleteClass 
}; 