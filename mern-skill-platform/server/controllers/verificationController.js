const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');
const Notification = require('../models/Notification');

// POST /api/verify  — faculty verifies a skill
const verifySkill = asyncHandler(async (req, res) => {
  const { skillId, status, feedback } = req.body;
  // status: Verified | Rejected | Needs Improvement
  const skill = await Skill.findById(skillId);
  if (!skill) { res.status(404); throw new Error('Skill not found'); }

  skill.status     = status;
  skill.feedback   = feedback || '';
  skill.verifiedBy = req.user._id;
  skill.verifiedAt = new Date();
  await skill.save();

  // Create notification for student
  const messages = {
    Verified:           `Your skill "${skill.name}" has been verified! ✅`,
    Rejected:           `Your skill "${skill.name}" was rejected. Please check feedback.`,
    'Needs Improvement':`Your skill "${skill.name}" needs improvement. See faculty feedback.`,
  };
  await Notification.create({
    userId:  skill.studentId,
    title:   `Skill ${status}`,
    message: messages[status] || `Your skill "${skill.name}" status updated.`,
    type:    status === 'Verified' ? 'skill_verified' : 'skill_rejected',
    link:    '/skills',
  });

  res.json(skill);
});

// GET /api/verify  — get all pending verifications (faculty)
const getPendingVerifications = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ status: 'Pending' })
    .populate('studentId', 'name email department rollNumber')
    .sort({ createdAt: -1 });
  res.json(skills);
});

// GET /api/verify/history  — all verified/rejected
const getVerificationHistory = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : { status: { $ne: 'Pending' } };
  const skills = await Skill.find(query)
    .populate('studentId', 'name department')
    .populate('verifiedBy', 'name')
    .sort({ verifiedAt: -1 });
  res.json(skills);
});

module.exports = { verifySkill, getPendingVerifications, getVerificationHistory };
