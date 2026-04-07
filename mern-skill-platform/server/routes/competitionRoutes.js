const express = require('express');
const router = express.Router();
const { addCompetition, getCompetitions, deleteCompetition } = require('../controllers/competitionController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/',      protect, upload.single('proof'), addCompetition);
router.get('/',       protect, getCompetitions);
router.delete('/:id', protect, deleteCompetition);

module.exports = router;
