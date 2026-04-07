const express = require('express');
const router = express.Router();
const { uploadCertificate, getCertificates, reviewCertificate, deleteCertificate } = require('../controllers/certificateController');
const { protect, facultyOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/',              protect, upload.single('certificate'), uploadCertificate);
router.get('/',               protect, getCertificates);
router.put('/:id/review',     protect, facultyOnly, reviewCertificate);
router.delete('/:id',         protect, deleteCertificate);

module.exports = router;
