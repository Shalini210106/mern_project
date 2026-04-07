const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  studentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true },
  organizer:  { type: String, default: '' },
  date:       { type: Date },
  level:      { type: String, enum: ['College', 'State', 'National', 'International'], default: 'College' },
  result:     { type: String, default: '' },
  position:   { type: String, default: '' },
  proofUrl:   { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Competition', competitionSchema);
