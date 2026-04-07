const express = require('express');
const router = express.Router();
const { verifySkill, getPendingVerifications, getVerificationHistory } = require('../controllers/verificationController');
const { protect, facultyOnly } = require('../middleware/authMiddleware');

router.post('/',         protect, facultyOnly, verifySkill);
router.get('/',          protect, facultyOnly, getPendingVerifications);
router.get('/history',   protect, facultyOnly, getVerificationHistory);

module.exports = router;
