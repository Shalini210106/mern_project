const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');
const User = require('../models/User');

const getLeaderboard = asyncHandler(async (req, res) => {
  const { department } = req.query;

  // Aggregate verified skill count per student
  const pipeline = [
    { $match: { status: 'Verified' } },
    { $group: { _id: '$studentId', verifiedCount: { $sum: 1 } } },
    { $sort: { verifiedCount: -1 } },
    { $limit: 50 },
    { $lookup: {
        from: 'users', localField: '_id', foreignField: '_id',
        as: 'student'
    }},
    { $unwind: '$student' },
    { $match: { 'student.role': 'student', ...(department ? { 'student.department': { $regex: department, $options: 'i' } } : {}) } },
    { $project: {
        _id: 1,
        name: '$student.name',
        department: '$student.department',
        avatar: '$student.avatar',
        rollNumber: '$student.rollNumber',
        verifiedCount: 1,
    }},
  ];

  const leaderboard = await Skill.aggregate(pipeline);
  const ranked = leaderboard.map((item, idx) => ({ ...item, rank: idx + 1 }));
  res.json(ranked);
});

module.exports = { getLeaderboard };
