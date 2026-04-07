const mongoose = require('mongoose');

// Required skills per category/domain
const skillGapSchema = new mongoose.Schema({
  domain:          { type: String, required: true, unique: true },
  requiredSkills:  [{ type: String }],
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('SkillGap', skillGapSchema);
