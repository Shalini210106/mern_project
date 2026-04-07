const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:         { type: String, required: true, trim: true },
  category:     { type: String, required: true },
  level:        { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  description:  { type: String, default: '' },
  status:       { type: String, enum: ['Pending', 'Verified', 'Rejected', 'Needs Improvement'], default: 'Pending' },
  verifiedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt:   { type: Date },
  feedback:     { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
