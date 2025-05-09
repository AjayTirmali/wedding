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
function checkFileType(file, cb) {
  // Allowed extensions
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
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Upload image
exports.uploadImage = (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Not authorized to perform this action' });
  }
  
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'File too large. Max size is 5MB' });
        }
        return res.status(400).json({ msg: err.message });
      } else {
        return res.status(400).json({ msg: err });
      }
    } else {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
      
      // Return file path
      const filePath = `/uploads/${req.file.filename}`;
      res.json({ 
        success: true, 
        filePath,
        originalName: req.file.originalname
      });
    }
  });
};

// Get all uploads
exports.getAllUploads = async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      return res.json([]);
    }
    
    const files = fs.readdirSync(uploadsDir);
    const fileObjects = files.map(filename => ({
      filename,
      path: `/uploads/${filename}`,
      uploadDate: fs.statSync(path.join(uploadsDir, filename)).mtime
    }));
    
    res.json(fileObjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete upload
exports.deleteUpload = async (req, res) => {
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
    
    res.json({ success: true, msg: 'File deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}; 