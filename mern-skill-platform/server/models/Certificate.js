const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  title:        { type: String, required: true },
  issuedBy:     { type: String, required: true },
  issuedDate:   { type: Date },
  fileUrl:      { type: String, required: true },
  filePublicId: { type: String },
  status:       { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewNote:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
