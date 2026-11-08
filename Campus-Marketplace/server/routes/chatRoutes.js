const express = require('express');
const router = express.Router();
const {
  getChats,
  getChatById,
  startChat,
  sendMessage,
  markChatAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(protect);

router.get('/', getChats);
router.post('/start', startChat);
router.put('/:chatId/read', markChatAsRead);
router.get('/:chatId', getChatById);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
