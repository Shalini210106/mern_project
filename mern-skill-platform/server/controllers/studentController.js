const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Skill = require('../models/Skill');

// GET /api/students  (faculty only)
const getStudents = asyncHandler(async (req, res) => {
  const { name, department, skill, page = 1, limit = 20 } = req.query;
  let query = { role: 'student' };
  if (department) query.department = { $regex: department, $options: 'i' };
  if (name) query.name = { $regex: name, $options: 'i' };

  let studentIds = null;
  if (skill) {
    const skills = await Skill.find({ name: { $regex: skill, $options: 'i' }, status: 'Verified' }).select('studentId');
    studentIds = skills.map(s => s.studentId.toString());
    query._id = { $in: studentIds };
  }

  const students = await User.find(query).select('-password')
    .skip((page - 1) * limit).limit(parseInt(limit));
  const total = await User.countDocuments(query);

  // Attach verified skill count
  const studentsWithSkills = await Promise.all(students.map(async (s) => {
    const verifiedCount = await Skill.countDocuments({ studentId: s._id, status: 'Verified' });
    const totalSkills   = await Skill.countDocuments({ studentId: s._id });
    return { ...s.toObject(), verifiedSkillCount: verifiedCount, totalSkillCount: totalSkills };
  }));

  res.json({ students: studentsWithSkills, page: parseInt(page), pages: Math.ceil(total / limit), total });
});

// GET /api/students/:id
const getStudentById = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id).select('-password');
  if (!student || student.role !== 'student') { res.status(404); throw new Error('Student not found'); }
  const skills = await Skill.find({ studentId: req.params.id }).populate('verifiedBy', 'name');
  res.json({ student, skills });
});

// PUT /api/students/:id  (student updates own profile)
const updateStudent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'faculty') {
    res.status(403); throw new Error('Not authorized');
  }
  user.name       = req.body.name       || user.name;
  user.department = req.body.department || user.department;
  user.bio        = req.body.bio        || user.bio;
  user.avatar     = req.body.avatar     || user.avatar;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, department: updated.department, bio: updated.bio, avatar: updated.avatar });
});

module.exports = { getStudents, getStudentById, updateStudent };
