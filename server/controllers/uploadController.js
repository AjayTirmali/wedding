const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Check file type
const checkFileType = (file, cb) => {
  // Allowed file types
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only (jpeg, jpg, png, gif)!');
  }
};

// Initialize upload middleware
const uploadSingle = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

const uploadMultiple = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).array('images', 10); // Allow up to 10 images

// Upload single image controller
const uploadImage = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to perform this action' });
  }

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'File too large. Max size is 5MB' });
        }
        return res.status(400).json({ msg: err.message });
      }
      return res.status(400).json({ msg: err });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      file: req.file,
      url: `/uploads/${req.file.filename}`
    });
  });
};

// Upload multiple images controller
const uploadImages = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to perform this action' });
  }

  uploadMultiple(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'File too large. Max size is 5MB' });
        }
        return res.status(400).json({ msg: err.message });
      }
      return res.status(400).json({ msg: err });
    }    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        msg: 'No files uploaded' 
      });
    }

    const fileUrls = req.files.map(file => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${req.files.length} image(s)`,
      files: fileUrls
    });
  });
};

// Get all uploads controller
const getAllUploads = async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ files: [] });
    }
    
    const files = fs.readdirSync(uploadsDir);
    const fileObjects = files.map(filename => ({
      filename,
      url: `/uploads/${filename}`,
      uploadDate: fs.statSync(path.join(uploadsDir, filename)).mtime
    }));
    
    res.status(200).json({
      success: true,
      files: fileObjects
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete upload controller
const deleteUpload = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }
    
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: 'File not found' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ 
      success: true, 
      msg: 'File deleted successfully' 
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  uploadImage,
  uploadImages,
  getAllUploads,
  deleteUpload
};