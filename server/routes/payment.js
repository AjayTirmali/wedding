const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Create payment order
router.post('/create-order', auth, paymentController.createOrder);

// Verify payment
router.post('/verify-payment', auth, paymentController.verifyPayment);

// Get payment details
router.get('/:id', auth, paymentController.getPaymentDetails);

module.exports = router;
