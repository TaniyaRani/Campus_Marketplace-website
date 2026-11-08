const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price in INR'],
      min: [0, 'Price must be a positive number']
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Original price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please specify product category'],
      enum: [
        'books',
        'electronics',
        'hostel',
        'engineering',
        'cycles',
        'stationery',
        'fashion',
        'sports',
        'other'
      ],
      default: 'other'
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Good', 'Fair', 'Acceptable'],
      default: 'Good'
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
      ]
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sellerInfo: {
      name: String,
      email: String,
      department: String,
      year: String,
      hostel: String,
      phone: String,
      rating: { type: Number, default: 5.0 },
      avatar: String,
      verifiedStudent: { type: Boolean, default: true }
    },
    location: {
      type: String,
      default: 'ABES Engineering College, Ghaziabad',
      trim: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'reserved', 'suspended', 'inactive'],
      default: 'active'
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for high performance search and filtering
ProductSchema.index({ title: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', ProductSchema);
