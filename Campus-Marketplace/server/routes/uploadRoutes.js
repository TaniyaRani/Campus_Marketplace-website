const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate clean unique filename: timestamp-random-cleanedOriginalName
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${cleanName}`);
  }
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  const allowedExts = /\.(jpg|jpeg|png|webp|gif)$/i;

  if (allowedMimeTypes.includes(file.mimetype) && allowedExts.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, and GIF image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum file size
  }
});

// Helper to construct full public URL
const getFileUrl = (req, filename) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  return `${protocol}://${host}/uploads/${filename}`;
};

router.use(protect);

// @desc    Upload a single product or avatar image
// @route   POST /api/upload/single
// @access  Protected
router.post('/single', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.'
      });
    }

    const fileUrl = getFileUrl(req, req.file.filename);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully!',
      url: fileUrl,
      relativeUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed.'
    });
  }
});

// @desc    Upload multiple product images (up to 6 images)
// @route   POST /api/upload/multiple
// @access  Protected
router.post('/multiple', upload.array('images', 6), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files uploaded.'
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      url: getFileUrl(req, file.filename),
      relativeUrl: `/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype
    }));

    return res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} images uploaded successfully!`,
      urls: uploadedFiles.map((f) => f.url),
      files: uploadedFiles
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Multiple images upload failed.'
    });
  }
});

router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Image upload failed.'
    });
  }
  return next();
});

module.exports = router;
