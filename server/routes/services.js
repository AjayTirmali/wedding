const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const serviceController = require('../controllers/serviceController');
const uploadController = require('../controllers/uploadController');

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.get('/category/:category', serviceController.getServicesByCategory);

// Admin only routes
router.post('/', [auth, admin], serviceController.createService);
router.put('/:id', [auth, admin], serviceController.updateService);
router.delete('/:id', [auth, admin], serviceController.deleteService);

// Category management (Admin only)
router.get('/categories/all', serviceController.getAllCategories);
router.post('/categories', [auth, admin], serviceController.createCategory);
router.put('/categories/:id', [auth, admin], serviceController.updateCategory);
router.delete('/categories/:id', [auth, admin], serviceController.deleteCategory);

// Initialize sample services (Admin only)
router.post('/initialize', [auth, admin], serviceController.initializeSampleServices);

// Upload service images (Admin only)
router.post('/upload', [auth, admin], uploadController.uploadImages);

module.exports = router;