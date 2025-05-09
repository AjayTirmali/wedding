const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const bookingController = require('../controllers/bookingController');

// Regular user routes
router.get('/my-bookings', auth, bookingController.getUserBookings);
router.post('/', auth, bookingController.createBooking);
router.get('/:id', auth, bookingController.getBookingById);

// Admin only routes
router.get('/', [auth, admin], bookingController.getAllBookings);
router.put('/:id/status', [auth, admin], bookingController.updateBookingStatus);
router.put('/:id', [auth, admin], bookingController.updateBooking);
router.delete('/:id', [auth, admin], bookingController.deleteBooking);
router.get('/stats/summary', [auth, admin], bookingController.getBookingStats);
router.get('/export/all', [auth, admin], bookingController.exportBookings);

module.exports = router;