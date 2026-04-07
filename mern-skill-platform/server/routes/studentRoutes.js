const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, updateStudent } = require('../controllers/studentController');
const { protect, facultyOnly } = require('../middleware/authMiddleware');

router.get('/',      protect, facultyOnly, getStudents);
router.get('/:id',   protect, getStudentById);
router.put('/:id',   protect, updateStudent);

module.exports = router;
