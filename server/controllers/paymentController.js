const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, services } = req.body;

    // Validate services
    const serviceIds = services.map(service => service._id);
    const validServices = await Service.find({ _id: { $in: serviceIds } });
    
    if (validServices.length !== services.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more services are invalid'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    // Create booking with pending status
    const booking = await Booking.create({
      user: req.user.id,
      services: serviceIds,
      totalAmount: amount,
      razorpayOrderId: order.id,
      status: 'Pending',
      paymentStatus: 'pending'
    });

    // Get user details for prefilling
    const user = await User.findById(req.user.id)
      .select('name email phoneNumber');

    res.json({
      success: true,
      order,
      booking,
      user
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({
      success: false,
      message: 'Could not create order'
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      services,
      amount
    } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update booking status
    const booking = await Booking.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'Confirmed',
        paymentStatus: 'completed'
      },
      { new: true }
    ).populate('services');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({
      success: false,
      message: 'Could not verify payment'
    });
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('services')
      .populate('user', 'name email phoneNumber');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (err) {
    console.error('Error fetching payment details:', err);
    res.status(500).json({
      success: false,
      message: 'Could not fetch payment details'
    });
  }
};
