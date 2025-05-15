const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

// @route   POST api/uploads/single
// @desc    Upload a single image
// @access  Private (admin only)
router.post('/single', auth, uploadController.uploadImage);

// @route   POST api/uploads/multiple
// @desc    Upload multiple images (up to 10)
// @access  Private (admin only)
router.post('/multiple', auth, uploadController.uploadImages);

// @route   GET api/uploads
// @desc    Get all uploads
// @access  Public
router.get('/', uploadController.getAllUploads);

// @route   DELETE api/uploads/:filename
// @desc    Delete an upload
// @access  Private (admin only)
router.delete('/:filename', auth, uploadController.deleteUpload);

module.exports = router;