const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
      unique: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productTitle: {
      type: String,
      default: ''
    },
    productPrice: {
      type: Number,
      default: 0
    },
    productImage: {
      type: String,
      default: ''
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastMessage: {
      type: String,
      default: ''
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

ChatSchema.index({ buyer: 1, seller: 1, product: 1 });

module.exports = mongoose.model('Chat', ChatSchema);
