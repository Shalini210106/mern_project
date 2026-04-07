const asyncHandler = require('express-async-handler');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

const addFeedback = asyncHandler(async (req, res) => {
  const { studentId, skillId, message, type } = req.body;
  const feedback = await Feedback.create({
    facultyId: req.user._id, studentId, skillId, message, type,
  });
  await Notification.create({
    userId:  studentId,
    title:   'New Faculty Feedback',
    message: `Faculty ${req.user.name} left feedback: "${message.substring(0, 60)}..."`,
    type:    'feedback',
    link:    '/feedback',
  });
  res.status(201).json(feedback);
});

const getFeedback = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === 'student') query.studentId = req.user._id;
  if (req.query.studentId) query.studentId = req.query.studentId;
  const feedbacks = await Feedback.find(query)
    .populate('facultyId', 'name')
    .populate('skillId', 'name')
    .sort({ createdAt: -1 });
  res.json(feedbacks);
});

const markFeedbackRead = asyncHandler(async (req, res) => {
  await Feedback.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
});

module.exports = { addFeedback, getFeedback, markFeedbackRead };
