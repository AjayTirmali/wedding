const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/user', auth, authController.getCurrentUser);

// Admin only routes
router.get('/users', [auth, admin], authController.getAllUsers);
router.put('/users/:userId/role', [auth, admin], authController.updateUserRole);
router.delete('/users/:userId', [auth, admin], authController.deleteUser);
router.put('/make-admin/:userId', [auth, admin], authController.makeAdmin);
router.get('/admin/stats', [auth, admin], authController.getAdminStats);

module.exports = router;