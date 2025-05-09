const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const userManagement = require('../utils/userManagement');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password,
      phoneNumber,
      role: role || 'client' // Default to client if no role provided
    });

    await user.save();

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and return JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Make user an admin
exports.makeAdmin = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }
    
    const { userId } = req.params;
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    res.json({ msg: 'User has been upgraded to admin', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const stats = await userManagement.getUserStats();
    const users = await User.find().select('-password');
    
    res.json({
      stats,
      users
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.userId;

    const updatedUser = await userManagement.updateUserRole(
      userId,
      role,
      req.user.id
    );

    res.json({
      msg: 'User role updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const result = await userManagement.deleteUserAndData(
      req.params.userId,
      req.user.id
    );
    
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
};

// Get admin dashboard statistics
exports.getAdminStats = async (req, res) => {
  try {
    const userStats = await userManagement.getUserStats();
    const userActivities = await Promise.all(
      (await User.find().limit(5))
        .map(user => userManagement.getUserActivity(user._id))
    );

    res.json({
      userStats,
      recentActivities: userActivities
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};