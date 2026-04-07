const asyncHandler = require('express-async-handler');
const Resource = require('../models/Resource');

const addResource = asyncHandler(async (req, res) => {
  const { title, description, url, category, skillTags } = req.body;
  const resource = await Resource.create({
    facultyId: req.user._id, title, description, url, category,
    skillTags: skillTags || [],
  });
  res.status(201).json(resource);
});

const getResources = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let query = {};
  if (category) query.category = { $regex: category, $options: 'i' };
  if (search)   query.title    = { $regex: search, $options: 'i' };
  const resources = await Resource.find(query).populate('facultyId', 'name').sort({ createdAt: -1 });
  res.json(resources);
});

const deleteResource = asyncHandler(async (req, res) => {
  const r = await Resource.findById(req.params.id);
  if (!r) { res.status(404); throw new Error('Resource not found'); }
  if (r.facultyId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  await r.deleteOne();
  res.json({ message: 'Resource removed' });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const Skill = require('../models/Skill');
  const User  = require('../models/User');

  const [
    totalStudents,
    totalSkills,
    verifiedSkills,
    pendingSkills,

    // Most popular skills
    topSkills,

    // Status distribution
    statusDist,

    // Students per department
    deptDist,
  ] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Skill.countDocuments(),
    Skill.countDocuments({ status: 'Verified' }),
    Skill.countDocuments({ status: 'Pending' }),
    Skill.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 10 },
    ]),
    Skill.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    summary: { totalStudents, totalSkills, verifiedSkills, pendingSkills },
    topSkills,
    statusDist,
    deptDist,
  });
});

module.exports = { addResource, getResources, deleteResource, getAnalytics };
