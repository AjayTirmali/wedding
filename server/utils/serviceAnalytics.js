const Service = require('../models/Service');

const serviceAnalytics = {
  // Get service metrics
  async getServiceMetrics() {
    try {
      const metrics = {
        // Basic service stats
        totalServices: await Service.countDocuments(),
        activeServices: await Service.countDocuments({ isAvailable: true }),
        
        // Category distribution
        categoryDistribution: await Service.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        
        // Top rated services
        topRatedServices: await Service.find()
          .sort({ 'rating.average': -1 })
          .limit(5)
          .select('name rating category')
      };
      
      return metrics;
    } catch (err) {
      throw new Error('Error getting service metrics: ' + err.message);
    }
  },

  // Get availability summary
  async getAvailabilitySummary() {
    try {
      const summary = {
        availableServices: await Service.countDocuments({ isAvailable: true }),
        unavailableServices: await Service.countDocuments({ isAvailable: false })
      };

      return summary;
    } catch (err) {
      throw new Error('Error getting availability summary: ' + err.message);
    }
  }
};

module.exports = serviceAnalytics;