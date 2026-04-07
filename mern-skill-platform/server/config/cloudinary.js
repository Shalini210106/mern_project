const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Only configure Cloudinary if credentials are provided
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Use local disk storage if Cloudinary not configured
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});

let upload;

if (hasCloudinary) {
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'skill_platform_certs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        resource_type: 'auto',
      },
    });
    upload = multer({ storage });
    console.log('✅ Cloudinary storage configured');
  } catch (e) {
    console.log('⚠️  Cloudinary setup failed, using local storage');
    upload = multer({ storage: localStorage });
  }
} else {
  console.log('ℹ️  No Cloudinary config — using local file storage');
  upload = multer({ storage: localStorage });
}

module.exports = { cloudinary, upload };
