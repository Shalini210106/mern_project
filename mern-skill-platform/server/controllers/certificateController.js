const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');
const Notification = require('../models/Notification');
const path = require('path');

// POST /api/certificates  (with file upload)
const uploadCertificate = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('No file uploaded'); }

  const { title, issuedBy, issuedDate, skillId } = req.body;

  // Support both Cloudinary (req.file.path) and local storage (req.file.filename)
  const fileUrl = req.file.path || `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
  const filePublicId = req.file.filename || req.file.public_id || '';

  const cert = await Certificate.create({
    studentId:    req.user._id,
    skillId:      skillId || null,
    title,
    issuedBy,
    issuedDate:   issuedDate || null,
    fileUrl,
    filePublicId,
  });
  res.status(201).json(cert);
});

// GET /api/certificates
const getCertificates = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === 'student') query.studentId = req.user._id;
  if (req.query.studentId) query.studentId = req.query.studentId;
  if (req.query.status) query.status = req.query.status;
  const certs = await Certificate.find(query)
    .populate('studentId', 'name department')
    .populate('skillId', 'name')
    .sort({ createdAt: -1 });
  res.json(certs);
});

// PUT /api/certificates/:id/review  (faculty approves/rejects)
const reviewCertificate = asyncHandler(async (req, res) => {
  const { status, reviewNote } = req.body;
  const cert = await Certificate.findById(req.params.id);
  if (!cert) { res.status(404); throw new Error('Certificate not found'); }
  cert.status     = status;
  cert.reviewNote = reviewNote || '';
  cert.reviewedBy = req.user._id;
  await cert.save();

  await Notification.create({
    userId:  cert.studentId,
    title:   `Certificate ${status}`,
    message: `Your certificate "${cert.title}" has been ${status.toLowerCase()}.`,
    type:    'certificate',
    link:    '/student/certificates',
  });

  res.json(cert);
});

// DELETE /api/certificates/:id
const deleteCertificate = asyncHandler(async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  if (!cert) { res.status(404); throw new Error('Certificate not found'); }
  if (cert.studentId.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized');
  }
  await cert.deleteOne();
  res.json({ message: 'Certificate removed' });
});

module.exports = { uploadCertificate, getCertificates, reviewCertificate, deleteCertificate };
