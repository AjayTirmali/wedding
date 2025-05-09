const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    handleChatMessage, 
    getChatHistory, 
    updateTypingStatus, 
    getChatSessions 
} = require('../controllers/chatController');

// @route   POST api/chat/message
// @desc    Send a message and get AI response
// @access  Private
router.post('/message', auth, handleChatMessage);

// @route   GET api/chat/history/:serviceId/:providerId
// @desc    Get chat history for a specific service provider
// @access  Private
router.get('/history/:serviceId/:providerId', auth, getChatHistory);

// @route   POST api/chat/typing
// @desc    Update typing status
// @access  Private
router.post('/typing', auth, updateTypingStatus);

// @route   GET api/chat/sessions
// @desc    Get all active chat sessions for a user
// @access  Private
router.get('/sessions', auth, getChatSessions);

module.exports = router;