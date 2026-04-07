const asyncHandler = require('express-async-handler');
const Competition = require('../models/Competition');

const addCompetition = asyncHandler(async (req, res) => {
  const { name, organizer, date, level, result, position } = req.body;
  const comp = await Competition.create({
    studentId: req.user._id, name, organizer, date, level, result, position,
    proofUrl: req.file ? req.file.path : '',
  });
  res.status(201).json(comp);
});

const getCompetitions = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === 'student') query.studentId = req.user._id;
  if (req.query.studentId) query.studentId = req.query.studentId;
  const comps = await Competition.find(query).populate('studentId', 'name department').sort({ date: -1 });
  res.json(comps);
});

const deleteCompetition = asyncHandler(async (req, res) => {
  const comp = await Competition.findById(req.params.id);
  if (!comp) { res.status(404); throw new Error('Competition not found'); }
  if (comp.studentId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  await comp.deleteOne();
  res.json({ message: 'Competition removed' });
});

module.exports = { addCompetition, getCompetitions, deleteCompetition };
