const User = require('../models/User');

// Admin middleware - check if user is an admin
module.exports = async function(req, res, next) {
  try {
    // Check if user exists and is admin
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied: Admin privileges required' });
    }

    // Add admin user to request for further use
    req.admin = user;
    next();
  } catch (err) {
    console.error('Admin middleware error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};