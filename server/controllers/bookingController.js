const Booking = require('../models/Booking');
const User = require('../models/User');

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('user', 'name email')
      .populate('services', 'name price');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate, sort = '-createdAt' } = req.query;
    let query = {};

    // Apply filters
    if (status) {
      query.status = status;
    }
    if (startDate && endDate) {
      query.eventDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phoneNumber')
      .populate('services', 'name price')
      .sort(sort);

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update booking status (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true }
    ).populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get booking statistics (Admin only)
exports.getBookingStats = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const stats = {
      overview: {
        total: await Booking.countDocuments(),
        pending: await Booking.countDocuments({ status: 'Pending' }),
        confirmed: await Booking.countDocuments({ status: 'Confirmed' }),
        completed: await Booking.countDocuments({ status: 'Completed' }),
        cancelled: await Booking.countDocuments({ status: 'Cancelled' })
      },
      monthlyStats: {
        total: await Booking.countDocuments({
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }),
        upcomingEvents: await Booking.find({
          eventDate: { $gte: currentDate },
          status: { $in: ['Confirmed', 'Pending'] }
        })
          .sort('eventDate')
          .limit(5)
          .populate('user', 'name email')
          .populate('services', 'name')
      }
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phoneNumber')
      .populate('services', 'name price description');
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if user is admin or the booking belongs to the user
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      eventDate,
      eventType,
      guestCount,
      venue,
      services,
      budget,
      specialRequests
    } = req.body;

    const newBooking = new Booking({
      user: req.user.id,
      eventDate,
      eventType,
      guestCount,
      venue,
      services,
      budget,
      specialRequests
    });

    const booking = await newBooking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if user is admin or the booking belongs to the user
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update booking fields
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedBooking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if user is admin or the booking belongs to the user
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await booking.remove();
    res.json({ msg: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
};

// Export all bookings
exports.exportBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phoneNumber')
      .populate('services', 'name price')
      .sort('-createdAt');

    const exportData = bookings.map(booking => ({
      id: booking._id,
      customerName: booking.user.name,
      customerEmail: booking.user.email,
      customerPhone: booking.user.phoneNumber,
      eventDate: booking.eventDate,
      eventType: booking.eventType,
      guestCount: booking.guestCount,
      venue: booking.venue,
      services: booking.services.map(s => s.name).join(', '),
      totalAmount: booking.services.reduce((sum, s) => sum + s.price, 0),
      status: booking.status,
      createdAt: booking.createdAt
    }));

    res.json(exportData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};