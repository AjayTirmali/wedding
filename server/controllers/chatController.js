const Service = require('../models/Service');
const Chat = require('../models/Chat');

// Rate limiting setup
const userMessageCounts = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_MESSAGES_PER_WINDOW = 30;

const isRateLimited = (userId) => {
  const now = Date.now();
  const userCount = userMessageCounts.get(userId) || { count: 0, timestamp: now };
  
  if (now - userCount.timestamp > RATE_LIMIT_WINDOW) {
    userMessageCounts.set(userId, { count: 1, timestamp: now });
    return false;
  }
  
  if (userCount.count >= MAX_MESSAGES_PER_WINDOW) {
    return true;
  }
  
  userCount.count += 1;
  userMessageCounts.set(userId, userCount);
  return false;
};

// Simple AI response generator based on context
const generateAIResponse = (message, providerContext) => {
  const lowercaseMessage = message.toLowerCase();
  
  // Basic response templates
  if (lowercaseMessage.includes('price') || lowercaseMessage.includes('cost')) {
    return `Our pricing varies based on your specific requirements. Could you please provide more details about your event date and expected guest count? This will help me provide you with an accurate quote from ${providerContext.name}.`;
  }
  
  if (lowercaseMessage.includes('available') || lowercaseMessage.includes('date')) {
    return `I'll help you check ${providerContext.name}'s availability. Could you please specify your preferred date and time? We typically need at least 2-3 weeks advance booking.`;
  }
  
  if (lowercaseMessage.includes('portfolio') || lowercaseMessage.includes('previous work')) {
    return `${providerContext.name} has completed ${providerContext.portfolio.length} showcase projects. Would you like me to share some specific examples from their portfolio?`;
  }
  
  if (lowercaseMessage.includes('experience')) {
    return `${providerContext.name} has ${providerContext.experience} years of experience in the industry, with a rating of ${providerContext.rating.average} from ${providerContext.rating.count} reviews.`;
  }
  
  if (lowercaseMessage.includes('book') || lowercaseMessage.includes('reserve')) {
    return `Great! To proceed with booking ${providerContext.name}'s services, I'll need the following details:
1. Your event date and time
2. Venue location
3. Expected number of guests
4. Any specific requirements or preferences

Could you please provide these details?`;
  }
  
  // Default response
  return `Thank you for your interest in ${providerContext.name}'s services. How can I assist you today? I can help you with:
- Pricing information
- Availability checking
- Portfolio showcase
- Booking process
- Specific requirements`;
};

// Handle chat messages
exports.handleChatMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check rate limiting
    if (isRateLimited(userId)) {
      return res.status(429).json({ 
        success: false, 
        msg: 'Too many messages. Please wait a moment before sending more.' 
      });
    }

    const { message, serviceId, providerId } = req.body;
    
    // Find the service and provider
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    
    const provider = service.serviceProviders.id(providerId);
    if (!provider) {
      return res.status(404).json({ msg: 'Service provider not found' });
    }
    
    // Find or create chat session
    let chat = await Chat.findOne({
      userId,
      serviceId,
      providerId,
      isActive: true
    });

    if (!chat) {
      chat = new Chat({
        userId,
        serviceId,
        providerId,
        messages: []
      });
    }

    // Add user message
    chat.messages.push({
      text: message,
      sender: 'user'
    });

    // Generate and add AI response
    const aiResponse = generateAIResponse(message, provider);
    chat.messages.push({
      text: aiResponse,
      sender: 'ai'
    });

    await chat.save();

    // Emit the message to other users in the chat room
    if (req.io) {
      const room = `chat_${serviceId}_${providerId}`;
      req.io.to(room).emit('receive_message', {
        id: Date.now(),
        text: aiResponse,
        sender: 'ai'
      });
    }
    
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date(),
      provider: {
        name: provider.name,
        id: provider._id
      }
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const { serviceId, providerId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({
      userId,
      serviceId,
      providerId,
      isActive: true
    }).sort('-lastMessageAt');

    if (!chat) {
      return res.json({
        success: true,
        history: []
      });
    }

    res.json({
      success: true,
      history: chat.messages,
      metadata: {
        serviceId,
        providerId,
        userId,
        lastMessageAt: chat.lastMessageAt
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Handle typing status
exports.updateTypingStatus = async (req, res) => {
  try {
    const { serviceId, providerId, isTyping } = req.body;
    
    res.json({
      success: true,
      status: {
        isTyping,
        userId: req.user.id,
        timestamp: new Date()
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get active chat sessions
exports.getChatSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await Chat.find({
      userId,
      isActive: true
    })
    .populate('serviceId', 'name category')
    .sort('-lastMessageAt')
    .lean();

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session._id,
        serviceName: session.serviceId.name,
        category: session.serviceId.category,
        lastMessageAt: session.lastMessageAt,
        messageCount: session.messages.length
      }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};