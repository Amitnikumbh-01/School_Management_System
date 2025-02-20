const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    schedule: {
      dayOfWeek: String,
      startTime: String,
      endTime: String
    }
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model('Class', classSchema);

module.exports = Class; 