const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  facultyId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  message:    { type: String, required: true },
  type:       { type: String, enum: ['general', 'skill', 'improvement'], default: 'general' },
  isRead:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
