const Service = require('../models/Service');
const Category = require('../models/Category');
const serviceAnalytics = require('../utils/serviceAnalytics');

// Add sample service providers
const sampleServiceProviders = {
  'Decoration': [
    {
      name: "Elegant Events Decor",
      description: "Luxury wedding decoration specialists with modern and traditional designs",
      experience: 8,
      portfolio: [
        { title: "Garden Wedding", description: "Outdoor wedding with floral arches", imageUrl: "/images/image_1.jpeg", date: new Date() },
        { title: "Royal Theme", description: "Indoor luxury decoration", imageUrl: "/images/image_2.jpeg", date: new Date() }
      ],
      rating: { average: 4.8, count: 156 },
      availability: {
        daysAvailable: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
        timeSlots: [{ start: "09:00", end: "18:00" }]
      }
    },
    {
      name: "Creative Spaces Design",
      description: "Contemporary wedding decoration with unique concepts",
      experience: 5,
      portfolio: [
        { title: "Minimalist Wedding", description: "Modern minimal design", imageUrl: "/images/image_3.jpeg", date: new Date() }
      ],
      rating: { average: 4.6, count: 89 }
    }
  ],
  'Photography': [
    {
      name: "Moments Forever",
      description: "Professional wedding photography and videography team",
      experience: 10,
      portfolio: [
        { title: "Beach Wedding", description: "Sunset ceremony capture", imageUrl: "/images/image_4.jpeg", date: new Date() },
        { title: "Traditional Wedding", description: "Cultural ceremony", imageUrl: "/images/image_5.jpeg", date: new Date() }
      ],
      rating: { average: 4.9, count: 203 },
      availability: {
        daysAvailable: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        timeSlots: [{ start: "08:00", end: "20:00" }]
      }
    },
    {
      name: "Artistic Angles",
      description: "Creative wedding photography with artistic touch",
      experience: 6,
      portfolio: [
        { title: "Candid Moments", description: "Natural wedding photography", imageUrl: "/images/image_6.jpeg", date: new Date() }
      ],
      rating: { average: 4.7, count: 125 },
      availability: {
        daysAvailable: ['Wednesday', 'Friday', 'Saturday', 'Sunday'],
        timeSlots: [{ start: "09:00", end: "19:00" }]
      }
    }
  ],
  'Catering': [
    {
      name: "Royal Feast Catering",
      description: "Multi-cuisine wedding catering service",
      experience: 12,
      portfolio: [
        { title: "International Buffet", description: "Global cuisine selection", imageUrl: "/images/image_7.jpeg", date: new Date() }
      ],
      rating: { average: 4.8, count: 178 }
    },
    {
      name: "Gourmet Celebrations",
      description: "Premium wedding catering with custom menus",
      experience: 7,
      portfolio: [
        { title: "Fusion Menu", description: "Modern fusion cuisine", imageUrl: "/images/image_8.jpeg", date: new Date() }
      ],
      rating: { average: 4.6, count: 145 }
    }
  ],
  'Entertainment': [
    {
      name: "Rhythm Events",
      description: "Professional DJ and live band services",
      experience: 9,
      portfolio: [
        { title: "Wedding Party", description: "Live band performance", imageUrl: "/images/image_9.jpeg", date: new Date() }
      ],
      rating: { average: 4.7, count: 167 }
    },
    {
      name: "Stellar Entertainment",
      description: "Complete wedding entertainment solutions",
      experience: 8,
      portfolio: [
        { title: "Dance Performance", description: "Professional dancers", imageUrl: "/images/image_10.jpeg", date: new Date() }
      ],
      rating: { average: 4.8, count: 134 }
    }
  ]
};

// Sample services data
const sampleServices = [
  {
    name: "Gulmohar inc. - Bespoke Weddings",
    description: "Transform your venue into a magical setting with our luxury decoration services. We offer custom themes, floral arrangements, and lighting design.",
    location: "Baner, Pune",
    category: "Decoration",
    price: 250000,
    pricingType: "Fixed",
    rating: 4.9,
    reviewCount: 25,
    featured: true,
    images: ['/images/image_1.jpeg'],
    features: ["Inhouse & outside decoration", "Unique Ideas", "In High Demand"],
    isAvailable: true
  },
  {
    name: "Genesis Inc",
    description: "Capture every precious moment of your special day with our professional photography team. Includes pre-wedding shoot and complete ceremony coverage.",
    location: "Bund Garden Road, Pune",
    category: "Photography",
    price: 200000,
    pricingType: "Fixed",
    rating: 4.9,
    reviewCount: 19,
    featured: false,
    images: ['/images/image_11.jpeg'],
    features: ["Inhouse & outside decoration", "High Quality Service"],
    isAvailable: true
  },
  {
    name: "Gourmet Wedding Feast",
    description: "Exquisite culinary experience with international cuisine options, professional service staff, and custom menu planning.",
    category: "Catering",
    price: 75,
    pricingType: "Per Person",
    features: ["Custom menu planning", "International cuisine", "Professional staff", "Special dietary accommodations"],
    isAvailable: true
  },
  {
    name: "Premium Entertainment Package",
    description: "Complete entertainment solution including live band, DJ, dancers, and custom music planning for your special day.",
    category: "Entertainment",
    price: 2000,
    pricingType: "Fixed",
    features: ["Live band performance", "Professional DJ", "Dance performances", "Custom music planning"],
    isAvailable: true
  }
];

// Helper function to ensure proper image paths
const normalizeImagePath = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/uploads/')) return imageUrl;
  if (!imageUrl.startsWith('/')) return `/${imageUrl}`;
  return imageUrl;
};

// Function to process service data before sending to client
const processServiceData = (service) => {
  if (!service) return null;
  
  // Process main service images
  if (service.images && Array.isArray(service.images)) {
    service.images = service.images.map(img => normalizeImagePath(img));
  }
  
  // Process provider portfolio images
  if (service.serviceProviders && Array.isArray(service.serviceProviders)) {
    service.serviceProviders = service.serviceProviders.map(provider => {
      if (provider.portfolio && Array.isArray(provider.portfolio)) {
        provider.portfolio = provider.portfolio.map(item => ({
          ...item,
          imageUrl: normalizeImagePath(item.imageUrl)
        }));
      }
      return provider;
    });
  }
  
  return service;
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    
    console.log('Raw services from DB:', services.map(s => ({ 
      id: s._id, 
      name: s.name, 
      images: s.images 
    })));
    
    // Transform services to ensure image URLs are correct
    const transformedServices = services.map(service => {
      const serviceObj = service.toObject();
      
      // Ensure images array exists and has valid URLs
      if (!serviceObj.images || serviceObj.images.length === 0) {
        serviceObj.images = [getDefaultImageForCategory(serviceObj.category)];
      } else {
        // Transform image URLs to ensure they're valid
        serviceObj.images = serviceObj.images.map(image => {
          if (!image) return getDefaultImageForCategory(serviceObj.category);
          if (image.startsWith('http')) return image;
          if (image.startsWith('/')) return image;
          return `/images/${image}`;
        });
      }
      
      return serviceObj;
    });
    
    res.json(transformedServices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Helper function to get default image based on category
const getDefaultImageForCategory = (category) => {
  const categoryImageMap = {
    'Decoration': '/images/image_1.jpeg',
    'Catering': '/images/image_6.jpeg',
    'Photography': '/images/image_11.jpeg',
    'Entertainment': '/images/image_16.jpeg',
    'Venue': '/images/image_21.jpeg',
    'Transportation': '/images/image_26.jpeg',
    'Other': '/images/image_31.jpeg'
  };
  return categoryImageMap[category] || '/images/image_1.jpeg';
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    res.json(processServiceData(service));
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Create service (Admin only)
exports.createService = async (req, res) => {
  try {
    const { category, price } = req.body;
    
    // Validate price
    if (price < 0) {
      return res.status(400).json({ msg: 'Price cannot be negative' });
    }
    
    const providers = sampleServiceProviders[category] || [];
    
    const newService = new Service({
      ...req.body,
      serviceProviders: providers,
      createdBy: req.user.id
    });
    
    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Invalid service data', errors: err.errors });
    }
    res.status(500).send('Server error');
  }
};

// Update service (Admin only)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        updatedAt: Date.now()
      },
      { 
        new: true,
        runValidators: true  // Run model validations on update
      }
    ).lean();
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    // Set cache control headers
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    res.json(service);
  } catch (err) {
    console.error('Service update error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        msg: 'Invalid service data', 
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    res.status(500).json({ 
      msg: 'Server error while updating service',
      error: err.message 
    });
  }
};

// Delete service (Admin only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    await service.remove();
    res.json({ msg: 'Service removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get service metrics (Admin only)
exports.getServiceMetrics = async (req, res) => {
  try {
    const metrics = await serviceAnalytics.getServiceMetrics();
    res.json(metrics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get service analysis (Admin only)
exports.getServiceAnalysis = async (req, res) => {
  try {
    const analysis = await serviceAnalytics.getServiceAnalysis(req.params.id);
    res.json(analysis);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Manage service availability (Admin only)
exports.updateServiceAvailability = async (req, res) => {
  try {
    const { isAvailable, availability, capacity } = req.body;
    
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        isAvailable,
        availability,
        capacity,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Manage service reviews (Admin only)
exports.manageServiceReviews = async (req, res) => {
  try {
    const { action } = req.body;
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    if (action === 'delete') {
      const { reviewId } = req.body;
      service.reviews = service.reviews.filter(
        review => review._id.toString() !== reviewId
      );
    }
    
    // Recalculate average rating
    if (service.reviews.length > 0) {
      const sum = service.reviews.reduce((acc, review) => acc + review.rating, 0);
      service.rating.average = sum / service.reviews.length;
      service.rating.count = service.reviews.length;
    } else {
      service.rating.average = 0;
      service.rating.count = 0;
    }
    
    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }
    
    const { name, description } = req.body;
    
    // Check if category already exists
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Category already exists' });
    }
    
    // Create new category
    const newCategory = new Category({
      name,
      description
    });
    
    category = await newCategory.save();
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }
    
    const { name, description } = req.body;
    
    // Build category object
    const categoryFields = {};
    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;
    
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    // Update
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to perform this action' });
    }
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    // Check if category is being used by any service
    const serviceCount = await Service.countDocuments({ category: category.name });
    
    if (serviceCount > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete category as it is being used by services',
        count: serviceCount
      });
    }
    
    await category.remove();
    
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Category not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Get services by category
exports.getServicesByCategory = async (req, res) => {
  try {
    const services = await Service.find({ category: req.params.category });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update service providers (Admin only)
exports.updateServiceProviders = async (req, res) => {
  try {
    const { providers } = req.body;
    
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    // Validate provider data
    if (providers && Array.isArray(providers)) {
      for (const provider of providers) {
        if (!provider.name || !provider.description || !provider.experience) {
          return res.status(400).json({ 
            msg: 'Each provider must have name, description, and experience' 
          });
        }
      }
    }
    
    service.serviceProviders = providers;
    await service.save();
    
    res.json(service);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.status(500).send('Server error');
  }
};

// Initialize sample services
exports.initializeSampleServices = async (req, res) => {
  try {
    // Clear existing services
    await Service.deleteMany({});

    // Create sample services with their providers
    const createdServices = await Promise.all(
      sampleServices.map(async (serviceData) => {
        const service = new Service({
          ...serviceData,
          serviceProviders: sampleServiceProviders[serviceData.category] || [],
          createdBy: req.user.id
        });
        return service.save();
      })
    );

    res.json({
      message: 'Sample services initialized successfully',
      services: createdServices
    });
  } catch (err) {
    console.error('Error initializing sample services:', err);
    res.status(500).json({ 
      msg: 'Server error while initializing services',
      error: err.message 
    });
  }
};