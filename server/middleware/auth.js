const jwt = require('jsonwebtoken');

// Rate limiting for auth attempts
const authAttempts = new Map();
const AUTH_LIMIT_WINDOW = 300000; // 5 minutes
const MAX_AUTH_ATTEMPTS = 50;

const isAuthRateLimited = (ip) => {
  const now = Date.now();
  const attempts = authAttempts.get(ip) || { count: 0, timestamp: now };
  
  if (now - attempts.timestamp > AUTH_LIMIT_WINDOW) {
    authAttempts.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  if (attempts.count >= MAX_AUTH_ATTEMPTS) {
    return true;
  }
  
  attempts.count += 1;
  authAttempts.set(ip, attempts);
  return false;
};

// Middleware to verify JWT token
module.exports = function(req, res, next) {
  // Check rate limiting
  const clientIP = req.ip || req.connection.remoteAddress;
  if (isAuthRateLimited(clientIP)) {
    return res.status(429).json({ 
      msg: 'Too many authentication attempts. Please try again later.' 
    });
  }

  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ msg: 'Token has expired' });
    }
    
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
};