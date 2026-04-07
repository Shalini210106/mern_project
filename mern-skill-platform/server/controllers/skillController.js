const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');
const Notification = require('../models/Notification');

// POST /api/skills
const addSkill = asyncHandler(async (req, res) => {
  const { name, category, level, description } = req.body;
  const skill = await Skill.create({
    studentId: req.user._id, name, category, level, description,
  });
  res.status(201).json(skill);
});

// GET /api/skills  (own skills for student, all for faculty)
const getSkills = asyncHandler(async (req, res) => {
  const { studentId, status, category } = req.query;
  let query = {};
  if (req.user.role === 'student') query.studentId = req.user._id;
  if (studentId) query.studentId = studentId;
  if (status) query.status = status;
  if (category) query.category = { $regex: category, $options: 'i' };
  const skills = await Skill.find(query).populate('verifiedBy', 'name').populate('studentId', 'name department');
  res.json(skills);
});

// PUT /api/skills/:id
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) { res.status(404); throw new Error('Skill not found'); }
  if (skill.studentId.toString() !== req.user._id.toString() && req.user.role !== 'faculty') {
    res.status(403); throw new Error('Not authorized');
  }
  skill.name        = req.body.name        || skill.name;
  skill.category    = req.body.category    || skill.category;
  skill.level       = req.body.level       || skill.level;
  skill.description = req.body.description || skill.description;
  const updated = await skill.save();
  res.json(updated);
});

// DELETE /api/skills/:id
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) { res.status(404); throw new Error('Skill not found'); }
  if (skill.studentId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  await skill.deleteOne();
  res.json({ message: 'Skill removed' });
});

// GET /api/skills/gap/:studentId  — skill gap analysis
const getSkillGap = asyncHandler(async (req, res) => {
  const SkillGap = require('../models/SkillGap');
  const { domain } = req.query;

  const studentSkills = await Skill.find({ studentId: req.params.studentId, status: 'Verified' }).select('name');
  const studentSkillNames = studentSkills.map(s => s.name.toLowerCase());

  let gapDomains = domain
    ? await SkillGap.find({ domain: { $regex: domain, $options: 'i' } })
    : await SkillGap.find();

  const analysis = gapDomains.map(g => {
    const required = g.requiredSkills;
    const present  = required.filter(r => studentSkillNames.includes(r.toLowerCase()));
    const missing  = required.filter(r => !studentSkillNames.includes(r.toLowerCase()));
    const percentage = required.length > 0 ? Math.round((present.length / required.length) * 100) : 0;
    return { domain: g.domain, required, present, missing, percentage };
  });

  res.json(analysis);
});

module.exports = { addSkill, getSkills, updateSkill, deleteSkill, getSkillGap };
