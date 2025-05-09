const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// Utility functions for user management
const userManagement = {
  // Get detailed user statistics
  async getUserStats() {
    try {
      const stats = {
        totalUsers: await User.countDocuments(),
        activeUsers: await User.countDocuments({ role: 'client' }),
        adminUsers: await User.countDocuments({ role: 'admin' }),
        newUsersThisMonth: await User.countDocuments({
          createdAt: {
            $gte: new Date(new Date().setDate(1)) // First day of current month
          }
        })
      };
      return stats;
    } catch (err) {
      throw new Error('Error getting user statistics');
    }
  },

  // Get user activity summary
  async getUserActivity(userId) {
    try {
      const bookings = await Booking.find({ user: userId })
        .sort('-createdAt')
        .limit(5);
      
      const userDetails = await User.findById(userId)
        .select('-password');

      return {
        user: userDetails,
        recentBookings: bookings,
        bookingCount: await Booking.countDocuments({ user: userId }),
        totalSpent: await Booking.aggregate([
          { $match: { user: userId } },
          { $group: { _id: null, total: { $sum: '$budget' } } }
        ])
      };
    } catch (err) {
      throw new Error('Error getting user activity');
    }
  },

  // Update user permissions
  async updateUserRole(userId, newRole, adminId) {
    try {
      // Don't allow self-demotion
      if (userId === adminId) {
        throw new Error('Cannot modify your own admin status');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      user.role = newRole;
      await user.save();

      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  // Delete user and associated data
  async deleteUserAndData(userId, adminId) {
    try {
      // Don't allow self-deletion
      if (userId === adminId) {
        throw new Error('Cannot delete your own admin account');
      }

      // Delete user's bookings
      await Booking.deleteMany({ user: userId });

      // Update services where user left reviews
      await Service.updateMany(
        { 'reviews.user': userId },
        { $pull: { reviews: { user: userId } } }
      );

      // Finally delete the user
      await User.findByIdAndDelete(userId);

      return { success: true, message: 'User and associated data deleted successfully' };
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

module.exports = userManagement;