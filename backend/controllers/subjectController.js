const Subject = require('../models/Subject');

const createSubject = async (req, res) => {
  try {
    const { name, teacher, class: classId } = req.body;
    const subject = await Subject.create({ name, teacher, class: classId });
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('teacher', 'name')
      .populate('class', 'name');
    res.json(subjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createSubject, getSubjects }; 