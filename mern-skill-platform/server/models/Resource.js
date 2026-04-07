const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  facultyId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  url:         { type: String, required: true },
  category:    { type: String, required: true },
  skillTags:   [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
