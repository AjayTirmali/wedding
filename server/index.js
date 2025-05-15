const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const serviceRoutes = require('./routes/services');
const uploadRoutes = require('./routes/uploads');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payment');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['Content-Type', 'Content-Length']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure static file serving for uploads and public images
app.use('/images', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, '../client/public/images'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Join a chat room
  socket.on('join_chat', ({ serviceId, providerId }) => {
    const room = `chat_${serviceId}_${providerId}`;
    socket.join(room);
    console.log(`Client ${socket.id} joined room: ${room}`);
  });

  // Handle new messages
  socket.on('new_message', ({ serviceId, providerId, message }) => {
    const room = `chat_${serviceId}_${providerId}`;
    socket.to(room).emit('receive_message', message);
  });

  // Handle typing status
  socket.on('typing', ({ serviceId, providerId, isTyping, userName }) => {
    const room = `chat_${serviceId}_${providerId}`;
    socket.to(room).emit('typing_status', { isTyping, userName });
  });

  // Leave chat room
  socket.on('leave_chat', ({ serviceId, providerId }) => {
    const room = `chat_${serviceId}_${providerId}`;
    socket.leave(room);
    console.log(`Client ${socket.id} left room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle reconnection
  socket.on('reconnect', (attemptNumber) => {
    console.log(`Client ${socket.id} reconnected after ${attemptNumber} attempts`);
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`Reconnection attempt #${attemptNumber}`);
  });

  socket.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error);
  });

  socket.on('reconnect_failed', () => {
    console.error('Failed to reconnect');
  });
});

// Add io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);

// Serve static files in development
app.use(express.static(path.join(__dirname, '../client/public')));

// Handle React routing in development and production
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('Could not connect to MongoDB:', err.message);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});