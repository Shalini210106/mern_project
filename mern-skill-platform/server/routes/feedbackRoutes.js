const express = require('express');
const router = express.Router();
const { addFeedback, getFeedback, markFeedbackRead } = require('../controllers/feedbackController');
const { protect, facultyOnly } = require('../middleware/authMiddleware');

router.post('/',          protect, facultyOnly, addFeedback);
router.get('/',           protect, getFeedback);
router.put('/:id/read',   protect, markFeedbackRead);

module.exports = router;
