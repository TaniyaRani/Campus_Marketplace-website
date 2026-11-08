const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ABES_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@abes\.ac\.in$/i;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide official college email (@abes.ac.in)'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        ABES_EMAIL_REGEX,
        'Please provide a valid ABES Engineering College email ending with @abes.ac.in'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true
    },
    year: {
      type: String,
      default: '1st Year',
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Faculty / Admin']
    },
    rollNumber: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: '+91 99999 88888'
    },
    hostel: {
      type: String,
      trim: true,
      default: 'Hostel / Day Scholar'
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    verifiedStudent: {
      type: Boolean,
      default: true
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Signed JWT Token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id || this.id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET || 'campus_marketplace_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

module.exports = mongoose.model('User', UserSchema);
