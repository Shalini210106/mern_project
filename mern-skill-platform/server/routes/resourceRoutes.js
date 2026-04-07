const express = require('express');
const router = express.Router();
const { addResource, getResources, deleteResource, getAnalytics } = require('../controllers/resourceController');
const { protect, facultyOnly } = require('../middleware/authMiddleware');

router.post('/',          protect, facultyOnly, addResource);
router.get('/',           protect, getResources);
router.delete('/:id',     protect, facultyOnly, deleteResource);
router.get('/analytics',  protect, facultyOnly, getAnalytics);

module.exports = router;
