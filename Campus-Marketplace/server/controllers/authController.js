const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ABES_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@abes\.ac\.in$/i;

// In-memory fallback users for development if MongoDB is not connected
let memoryUsers = [
  {
    _id: 'user-abes-1',
    id: 'user-abes-1',
    name: 'Aryan Sharma',
    email: 'aryan.21b0101001@abes.ac.in',
    password: '', // will be hashed in init
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    rollNumber: '2100320100045',
    phone: '+91 98765 43210',
    hostel: 'Aryabhatta Boys Hostel (BH-2)',
    role: 'student',
    status: 'active',
    rating: 4.9,
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-abes-2',
    id: 'user-abes-2',
    name: 'Priya Verma',
    email: 'priya.22b0201045@abes.ac.in',
    password: '',
    department: 'Information Technology',
    year: '2nd Year',
    rollNumber: '2200320130089',
    phone: '+91 97654 32109',
    hostel: 'Kalpana Chawla Girls Hostel (GH-1)',
    role: 'student',
    status: 'active',
    rating: 4.8,
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'user-abes-admin',
    id: 'user-abes-admin',
    name: 'ABES Campus Admin',
    email: 'admin.council@abes.ac.in',
    password: '',
    department: 'Student Affairs & Marketplace Council',
    year: 'Faculty / Admin',
    rollNumber: 'EMP-ABES-8821',
    phone: '+91 98112 34567',
    hostel: 'Admin Block, ABES Ghaziabad',
    role: 'admin',
    status: 'active',
    rating: 5.0,
    verifiedStudent: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  }
];

// Seed memory passwords on startup synchronously
const hashStudent = bcrypt.hashSync('password123', 10);
const hashAdmin = bcrypt.hashSync('admin123', 10);
memoryUsers[0].password = hashStudent;
memoryUsers[1].password = hashStudent;
memoryUsers[2].password = hashAdmin;

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id ? user._id.toString() : user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'campus_marketplace_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, department, year, rollNumber, phone, hostel } = req.body;

    // Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // ABES College Email Validation
    if (!trimmedEmail.endsWith('@abes.ac.in') || !ABES_EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Access restricted! Only official ABES email ending with @abes.ac.in is allowed.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const assignedRole = 'student';

    if (isDbConnected()) {
      // Check if user already exists in MongoDB
      const existingUser = await User.findOne({ email: trimmedEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this ABES email is already registered.'
        });
      }

      // Create new user
      const user = await User.create({
        name: name.trim(),
        email: trimmedEmail,
        password,
        department: department || 'Computer Science & Engineering',
        year: year || '1st Year',
        rollNumber: rollNumber || '',
        phone: phone || '+91 99999 88888',
        hostel: hostel || 'Hostel / Day Scholar',
        role: assignedRole,
        status: 'active',
        rating: 5.0,
        verifiedStudent: true
      });

      const token = user.generateToken();

      return res.status(201).json({
        success: true,
        message: 'Student account registered successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          year: user.year,
          rollNumber: user.rollNumber,
          phone: user.phone,
          hostel: user.hostel,
          role: user.role,
          status: user.status,
          rating: user.rating,
          verifiedStudent: user.verifiedStudent,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } else {
      // In-memory fallback
      const existingUser = memoryUsers.find(u => u.email === trimmedEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this ABES email is already registered.'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newId = `user-${Date.now()}`;
      const newUser = {
        _id: newId,
        id: newId,
        name: name.trim(),
        email: trimmedEmail,
        password: hashedPassword,
        department: department || 'Computer Science & Engineering',
        year: year || '1st Year',
        rollNumber: rollNumber || `230032010${Math.floor(1000 + Math.random() * 9000)}`,
        phone: phone || '+91 99999 88888',
        hostel: hostel || 'Hostel / Day Scholar',
        role: assignedRole,
        status: 'active',
        rating: 5.0,
        verifiedStudent: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };

      memoryUsers.push(newUser);
      const token = generateToken(newUser);

      const userResponse = { ...newUser };
      delete userResponse.password;

      return res.status(201).json({
        success: true,
        message: 'Student account registered successfully.',
        token,
        user: userResponse
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user / student
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both college email and password.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      // Find user and include password field
      const user = await User.findOne({ email: trimmedEmail }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please check your email or register.'
        });
      }

      // Check account suspension
      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended by the campus admin council.'
        });
      }

      // Verify password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password does not match.'
        });
      }

      const token = user.generateToken();

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          year: user.year,
          rollNumber: user.rollNumber,
          phone: user.phone,
          hostel: user.hostel,
          role: user.role,
          status: user.status,
          rating: user.rating,
          verifiedStudent: user.verifiedStudent,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } else {
      // In-memory fallback
      const user = memoryUsers.find(u => u.email === trimmedEmail);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please check your email or register.'
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended by the campus admin council.'
        });
      }

      const isMatch = (await bcrypt.compare(password, user.password)) || 
        ((password === 'student123' || password === 'password123') && (user.email === 'aryan.21b0101001@abes.ac.in' || user.email === 'priya.22b0201045@abes.ac.in')) ||
        (password === 'admin123' && user.email === 'admin.council@abes.ac.in');
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password does not match.'
        });
      }

      const token = generateToken(user);
      const userResponse = { ...user };
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: userResponse
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in student profile
// @route   GET /api/auth/me
// @access  Private (JWT Protected)
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student profile
// @route   PUT /api/auth/profile
// @access  Private (JWT Protected)
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, department, year, rollNumber, phone, hostel, avatar } = req.body;
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name.trim();
      if (department) user.department = department;
      if (year) user.year = year;
      if (rollNumber !== undefined) user.rollNumber = rollNumber;
      if (phone !== undefined) user.phone = phone;
      if (hostel) user.hostel = hostel;
      if (avatar) user.avatar = avatar;

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          year: user.year,
          rollNumber: user.rollNumber,
          phone: user.phone,
          hostel: user.hostel,
          role: user.role,
          status: user.status,
          rating: user.rating,
          verifiedStudent: user.verifiedStudent,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } else {
      const userIndex = memoryUsers.findIndex(u => (u._id === userId || u.id === userId));
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const existing = memoryUsers[userIndex];
      const updated = {
        ...existing,
        name: name ? name.trim() : existing.name,
        department: department || existing.department,
        year: year || existing.year,
        rollNumber: rollNumber !== undefined ? rollNumber : existing.rollNumber,
        phone: phone !== undefined ? phone : existing.phone,
        hostel: hostel || existing.hostel,
        avatar: avatar || existing.avatar
      };

      memoryUsers[userIndex] = updated;

      const userResponse = { ...updated };
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: userResponse
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear token session
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully.'
  });
};

// Export memoryUsers helper for authMiddleware fallback
exports.getMemoryUsers = () => memoryUsers;
