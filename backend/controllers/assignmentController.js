const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const Submission = require('../models/Submission');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private
const createAssignment = async (req, res) => {
  try {
    const { title, description, class: classId, dueDate } = req.body;

    // Check if class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      class: classId,
      teacher: req.user._id,
      dueDate,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get assignments based on user role
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
  try {
    let assignments;
    if (req.user.role === 'teacher') {
      assignments = await Assignment.find({ teacher: req.user._id })
        .populate('class', 'name')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'student') {
      // Get classes where student is enrolled
      const studentClasses = await Class.find({ students: req.user._id });
      const classIds = studentClasses.map(c => c._id);
      
      // Get assignments with submission status
      assignments = await Assignment.find({ class: { $in: classIds } })
        .populate('class', 'name')
        .populate('teacher', 'name')
        .populate({
          path: 'submissions',
          match: { student: req.user._id }
        })
        .sort({ dueDate: 1 });
    }
    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get assignments by class
// @route   GET /api/assignments/class/:classId
// @access  Private
const getAssignmentsByClass = async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId })
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error('Get class assignments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Students only)
const submitAssignment = async (req, res) => {
  try {
    const { submission } = req.body;
    const assignmentId = req.params.id;

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student is enrolled in the class
    const classObj = await Class.findById(assignment.class);
    if (!classObj.students.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not enrolled in this class' });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user._id,
    });

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.content = submission;
      existingSubmission.submittedAt = Date.now();
      await existingSubmission.save();
      
      // Update assignment with submission status
      assignment.submissions = assignment.submissions || [];
      assignment.submissions.push(existingSubmission._id);
      await assignment.save();

      return res.json(existingSubmission);
    }

    // Create new submission
    const newSubmission = await Submission.create({
      assignment: assignmentId,
      student: req.user._id,
      content: submission,
      submittedAt: Date.now(),
    });

    // Update assignment with submission status
    assignment.submissions = assignment.submissions || [];
    assignment.submissions.push(newSubmission._id);
    await assignment.save();

    res.status(201).json(newSubmission);
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Failed to submit assignment' });
  }
};

// @desc    Update an assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teachers only)
const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const assignmentId = req.params.id;

    // Find assignment and check ownership
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify teacher owns this assignment
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this assignment' });
    }

    // Update the assignment
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { title, description, dueDate },
      { new: true }
    )
    .populate('class', 'name')
    .populate('teacher', 'name');

    res.json(updatedAssignment);
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Failed to update assignment' });
  }
};

// @desc    Delete an assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teachers only)
const deleteAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    // Find assignment and check ownership
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Verify teacher owns this assignment
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this assignment' });
    }

    // Delete all submissions for this assignment
    await Submission.deleteMany({ assignment: assignmentId });

    // Delete the assignment
    await Assignment.findByIdAndDelete(assignmentId);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentsByClass,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
}; 