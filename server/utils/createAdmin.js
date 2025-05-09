const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Connected to MongoDB');
    
    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@weddingplanner.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@weddingplanner.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('Admin user created successfully');
    console.log('Email: admin@weddingplanner.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err.message);
    process.exit(1);
  }
};

createAdminUser(); 