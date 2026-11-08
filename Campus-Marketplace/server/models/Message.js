const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderName: {
      type: String,
      default: ''
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Message text cannot be empty'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

MessageSchema.index({ chatId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
