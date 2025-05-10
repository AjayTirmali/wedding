const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Decoration', 'Catering', 'Photography', 'Entertainment', 'Venue', 'Transportation', 'Other'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  pricingType: {
    type: String,
    enum: ['Fixed', 'Per Hour', 'Per Person', 'Custom'],
    default: 'Fixed'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  serviceProviders: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    portfolio: [{
      title: String,
      description: String,
      imageUrl: String,
      date: Date
    }],
    rating: {
      average: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);