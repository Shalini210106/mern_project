const express = require('express');
const router = express.Router();
const { addSkill, getSkills, updateSkill, deleteSkill, getSkillGap } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',                    protect, addSkill);
router.get('/',                     protect, getSkills);
router.put('/:id',                  protect, updateSkill);
router.delete('/:id',               protect, deleteSkill);
router.get('/gap/:studentId',       protect, getSkillGap);

module.exports = router;
