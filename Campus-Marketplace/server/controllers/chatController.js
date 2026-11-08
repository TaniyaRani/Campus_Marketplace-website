const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Product = require('../models/Product');
const { getMemoryProducts } = require('./productController');

const isDbConnected = () => mongoose.connection.readyState === 1;

const formatMessage = (message) => ({
  id: message.id || message._id,
  sender: message.sender?._id || message.sender,
  senderName: message.senderName || message.sender?.name || 'ABES Student',
  text: message.text,
  time: message.time || (message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Now'),
  createdAt: message.createdAt
});

const formatChat = (chat, messages = [], viewerId) => {
  const buyer = chat.buyer && typeof chat.buyer === 'object' ? chat.buyer : null;
  const seller = chat.seller && typeof chat.seller === 'object' ? chat.seller : null;
  const buyerId = (buyer?._id || buyer?.id || chat.buyerId || chat.buyer || '').toString();
  const sellerId = (seller?._id || seller?.id || chat.sellerId || chat.seller || '').toString();
  const isBuyer = viewerId ? buyerId === viewerId.toString() : true;
  const peer = (isBuyer ? seller : buyer) || chat.participant;

  const product = chat.product && typeof chat.product === 'object' ? chat.product : null;

  return {
    id: chat.chatId || chat.id,
    chatId: chat.chatId || chat.id,
    productId: chat.productId || product?._id || product?.id || chat.product,
    productTitle: chat.productTitle || product?.title || 'Product Listing',
    productPrice: chat.productPrice ?? product?.price ?? 0,
    productImage: chat.productImage || product?.images?.[0] || '',
    buyerId,
    sellerId,
    isBuyer,
    participant: peer ? {
      id: (peer._id || peer.id || '').toString(),
      name: peer.name || 'ABES Student',
      email: peer.email || '',
      avatar: peer.avatar || '',
      department: peer.department || 'Engineering'
    } : chat.participant,
    messages: (messages.length ? messages : chat.messages || []).map(formatMessage),
    unread: messages.some((message) => message.receiver)
      ? messages.filter((message) => message.receiver?.toString() === viewerId?.toString() && !message.isRead).length
      : (chat.unread || 0),
    lastMessage: chat.lastMessage || '',
    updatedAt: chat.updatedAt || chat.lastMessageAt
  };
};

// Initial in-memory chats fallback
let memoryChats = [
  {
    id: 'chat-1',
    chatId: 'chat-1',
    productId: 'prod-3',
    productTitle: 'Hero Sprint 21-Speed Mountain Gear Bicycle',
    productPrice: 3800,
    productImage: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80',
    buyerId: 'user-abes-1',
    sellerId: 'user-abes-3',
    participant: {
      id: 'user-abes-3',
      name: 'Rohan Gupta',
      email: 'rohan.20b0301089@abes.ac.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      department: 'Mechanical Engineering (4th Yr)'
    },
    messages: [
      { id: 'm1', sender: 'user-abes-3', senderName: 'Rohan Gupta', text: 'Hey Aryan! Saw you were checking out the cycle.', time: '10:14 AM', createdAt: new Date('2026-11-05T10:14:00Z').toISOString() },
      { id: 'm2', sender: 'user-abes-1', senderName: 'Aryan Sharma', text: 'Yes brother! Is the gearing working smoothly? Any chain drops?', time: '10:16 AM', createdAt: new Date('2026-11-05T10:16:00Z').toISOString() },
      { id: 'm3', sender: 'user-abes-3', senderName: 'Rohan Gupta', text: 'Smooth as butter! I got it greased at Lal Kuan cycle shop last Friday. Can test ride it at main gate.', time: '10:18 AM', createdAt: new Date('2026-11-05T10:18:00Z').toISOString() },
      { id: 'm4', sender: 'user-abes-1', senderName: 'Aryan Sharma', text: 'Awesome! Can we meet around 4:30 PM near the campus canteen?', time: '10:20 AM', createdAt: new Date('2026-11-05T10:20:00Z').toISOString() }
    ],
    unread: 0,
    lastMessage: 'Awesome! Can we meet around 4:30 PM near the campus canteen?',
    updatedAt: new Date('2026-11-05T10:20:00Z').toISOString()
  },
  {
    id: 'chat-2',
    chatId: 'chat-2',
    productId: 'prod-2',
    productTitle: 'Omega Mini Drafter with Cover & Steel Clips',
    productPrice: 320,
    productImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&auto=format&fit=crop&q=80',
    buyerId: 'user-abes-1',
    sellerId: 'user-abes-2',
    participant: {
      id: 'user-abes-2',
      name: 'Priya Verma',
      email: 'priya.22b0201045@abes.ac.in',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      department: 'IT (2nd Yr)'
    },
    messages: [
      { id: 'm20', sender: 'user-abes-1', senderName: 'Aryan Sharma', text: 'Hi Priya, does the drafter include the drawing sheet clips?', time: 'Yesterday', createdAt: new Date('2026-11-04T12:00:00Z').toISOString() },
      { id: 'm21', sender: 'user-abes-2', senderName: 'Priya Verma', text: 'Yes, 4 metal clips plus the protective zip bag included!', time: 'Yesterday', createdAt: new Date('2026-11-04T12:05:00Z').toISOString() }
    ],
    unread: 1,
    lastMessage: 'Yes, 4 metal clips plus the protective zip bag included!',
    updatedAt: new Date('2026-11-04T12:05:00Z').toISOString()
  }
];

// @desc    Get all chat threads for the current user (as buyer or seller)
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res, next) => {
  try {
    const userId = (req.user.id || req.user._id).toString();

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const chats = await Chat.find({
        $or: [{ buyer: userId }, { seller: userId }]
      })
        .populate('buyer', 'name email department year avatar')
        .populate('seller', 'name email department year avatar')
        .populate('product', 'title price images status')
        .sort({ updatedAt: -1 });

      const chatIds = chats.map((chat) => chat.chatId);
      const messages = await Message.find({ chatId: { $in: chatIds } }).sort({ createdAt: 1 });
      const messagesByChat = messages.reduce((acc, message) => {
        if (!acc[message.chatId]) acc[message.chatId] = [];
        acc[message.chatId].push(message);
        return acc;
      }, {});

      const formatted = chats.map((chat) => {
        const chatMessages = messagesByChat[chat.chatId] || [];
        return {
          ...formatChat(chat, chatMessages, userId),
          unread: chatMessages.filter((message) =>
            message.receiver?.toString() === userId && !message.isRead
          ).length
        };
      });

      return res.status(200).json({
        success: true,
        count: formatted.length,
        data: formatted
      });
    }

    // In-memory fallback
    const userChats = memoryChats
      .filter(c => c.buyerId === userId || c.sellerId === userId || c.participant?.id === userId)
      .map(chat => formatChat(chat, chat.messages || [], userId));

    return res.status(200).json({
      success: true,
      count: userChats.length,
      data: userChats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history of a specific chat
// @route   GET /api/chats/:chatId
// @access  Private
exports.getChatById = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    if (isDbConnected()) {
      const chat = await Chat.findOne({ chatId })
        .populate('buyer', 'name email department year avatar phone')
        .populate('seller', 'name email department year avatar phone')
        .populate('product');

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: `Chat conversation ${chatId} not found.`
        });
      }

      // Check authorization
      const buyerId = chat.buyer._id ? chat.buyer._id.toString() : chat.buyer.toString();
      const sellerId = chat.seller._id ? chat.seller._id.toString() : chat.seller.toString();

      if (buyerId !== userId && sellerId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this conversation.'
        });
      }

      const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        chat,
        messages
      });
    }

    // In-memory fallback
    const chat = memoryChats.find(c => c.chatId === chatId || c.id === chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: `Chat conversation ${chatId} not found.`
      });
    }

    if (chat.buyerId !== userId && chat.sellerId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation.'
      });
    }

    return res.status(200).json({
      success: true,
      chat,
      messages: chat.messages || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start or retrieve existing chat between buyer and seller for a product
// @route   POST /api/chats/start
// @access  Private
exports.startChat = async (req, res, next) => {
  try {
    const { productId, sellerId, initialMessage } = req.body;
    const buyerId = (req.user.id || req.user._id).toString();

    if (!productId || !sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and Seller ID are required.'
      });
    }

    if (buyerId === sellerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot initiate a chat with yourself for your own listing.'
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(buyerId) && mongoose.Types.ObjectId.isValid(sellerId)) {
      const product = await Product.findById(productId);
      if (!product || product.seller.toString() !== sellerId) {
        return res.status(404).json({
          success: false,
          message: 'Product listing or its seller could not be found.'
        });
      }

      let chat = await Chat.findOne({
        product: productId,
        buyer: buyerId,
        seller: sellerId
      })
        .populate('buyer', 'name email department year avatar')
        .populate('seller', 'name email department year avatar')
        .populate('product');

      if (!chat) {
        const chatId = `chat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        chat = await Chat.create({
          chatId,
          product: productId,
          productTitle: product ? product.title : '',
          productPrice: product ? product.price : 0,
          productImage: product && product.images?.[0] ? product.images[0] : '',
          buyer: buyerId,
          seller: sellerId,
          lastMessage: initialMessage || 'Interested in this item.',
          lastMessageAt: new Date()
        });

        if (initialMessage && initialMessage.trim()) {
          await Message.create({
            chatId,
            sender: buyerId,
            senderName: req.user.name,
            receiver: sellerId,
            text: initialMessage.trim()
          });
        }

        chat = await Chat.findOne({ chatId })
          .populate('buyer', 'name email department year avatar')
          .populate('seller', 'name email department year avatar')
          .populate('product');
      }

      const history = await Message.find({ chatId: chat.chatId }).sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        chatId: chat.chatId,
        data: formatChat(chat, history, buyerId)
      });
    }

    // In-memory fallback
    const product = getMemoryProducts()
      .find((item) => item.id === productId || item._id === productId);
    if (!product || (product.sellerInfo?.id || product.seller) !== sellerId) {
      return res.status(404).json({
        success: false,
        message: 'Product listing or its seller could not be found.'
      });
    }

    let existing = memoryChats.find(
      c => c.productId === productId && c.buyerId === buyerId && c.sellerId === sellerId
    );

    if (existing) {
      return res.status(200).json({
        success: true,
        chatId: existing.chatId || existing.id,
        data: formatChat(existing, existing.messages || [], buyerId)
      });
    }

    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      chatId: newChatId,
      productId,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.images?.[0] || '',
      buyerId,
      sellerId,
      buyer: {
        id: buyerId,
        name: req.user.name || 'ABES Student',
        email: req.user.email || '',
        avatar: req.user.avatar || ''
      },
      seller: {
        id: sellerId,
        name: product.sellerInfo?.name || 'Campus Seller',
        email: product.sellerInfo?.email || 'seller@abes.ac.in',
        avatar: product.sellerInfo?.avatar || '',
        department: product.sellerInfo?.department || 'ABES Student'
      },
      messages: initialMessage ? [
        {
          id: `msg-${Date.now()}`,
          sender: buyerId,
          receiver: sellerId,
          senderName: req.user.name || 'ABES Student',
          text: initialMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString()
        }
      ] : [],
      unread: 0,
      lastMessage: initialMessage || 'Chat started',
      updatedAt: new Date().toISOString()
    };

    memoryChats.unshift(newChat);

    return res.status(201).json({
      success: true,
      chatId: newChatId,
      data: formatChat(newChat, newChat.messages || [], buyerId)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send and save message in a chat conversation
// @route   POST /api/chats/:chatId/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const senderId = (req.user.id || req.user._id).toString();

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message text cannot be empty.'
      });
    }

    if (isDbConnected()) {
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: `Conversation ${chatId} not found.`
        });
      }

      const buyerId = chat.buyer.toString();
      const sellerId = chat.seller.toString();
      if (senderId !== buyerId && senderId !== sellerId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to send messages in this conversation.'
        });
      }
      const actualReceiverId = senderId === buyerId ? sellerId : buyerId;

      const message = await Message.create({
        chatId,
        sender: senderId,
        senderName: req.user.name,
        receiver: actualReceiverId,
        text: text.trim()
      });

      chat.lastMessage = text.trim();
      chat.lastMessageAt = new Date();
      await chat.save();

      return res.status(201).json({
        success: true,
        message: 'Message saved successfully',
        data: message
      });
    }

    // In-memory fallback
    const chat = memoryChats.find(c => c.chatId === chatId || c.id === chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: `Conversation ${chatId} not found.`
      });
    }

    if (chat.buyerId !== senderId && chat.sellerId !== senderId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages in this conversation.'
      });
    }

    const receiver = senderId === chat.buyerId ? chat.sellerId : chat.buyerId;
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: senderId,
      receiver,
      senderName: req.user.name || 'ABES Student',
      text: text.trim(),
      isRead: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString()
    };

    if (!chat.messages) {
      chat.messages = [];
    }
    chat.messages.push(newMessage);
    chat.lastMessage = text.trim();
    chat.updatedAt = new Date().toISOString();
    chat.unread = senderId === chat.buyerId ? 1 : 0;

    return res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
};

exports.markChatAsRead = async (req, res, next) => {
  try {
    const chatId = req.params.chatId;
    const userId = (req.user.id || req.user._id).toString();

    if (isDbConnected()) {
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: `Conversation ${chatId} not found.`
        });
      }
      if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this conversation.'
        });
      }
      await Message.updateMany(
        { chatId, receiver: userId, isRead: false },
        { $set: { isRead: true } }
      );
      return res.status(200).json({ success: true, message: 'Messages marked as read.' });
    }

    const chat = memoryChats.find((item) => item.chatId === chatId || item.id === chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: `Conversation ${chatId} not found.`
      });
    }
    if (chat.buyerId !== userId && chat.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this conversation.'
      });
    }
    chat.messages = (chat.messages || []).map((message) =>
      message.receiver === userId ? { ...message, isRead: true } : message
    );
    chat.unread = 0;
    return res.status(200).json({ success: true, message: 'Messages marked as read.' });
  } catch (error) {
    next(error);
  }
};
