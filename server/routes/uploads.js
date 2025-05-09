const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

// @route   POST api/uploads
// @desc    Upload an image
// @access  Private (admin only)
router.post('/', auth, uploadController.uploadImage);

// @route   GET api/uploads
// @desc    Get all uploads
// @access  Public
router.get('/', uploadController.getAllUploads);

// @route   DELETE api/uploads/:filename
// @desc    Delete an upload
// @access  Private (admin only)
router.delete('/:filename', auth, uploadController.deleteUpload);

module.exports = router; 