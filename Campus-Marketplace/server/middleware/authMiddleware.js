const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getMemoryUsers } = require('../controllers/authController');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.protect = async (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No Bearer token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'campus_marketplace_super_secret_jwt_key_2026'
    );

    if (isDbConnected()) {
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.'
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Account has been suspended by campus administrator.'
        });
      }

      req.user = {
        id: user._id,
        _id: user._id,
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
        avatar: user.avatar
      };
    } else {
      // In-memory fallback
      const memoryUsers = getMemoryUsers();
      const user = memoryUsers.find(u => (u._id === decoded.id || u.id === decoded.id));

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.'
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Account has been suspended by campus administrator.'
        });
      }

      const userCopy = { ...user };
      delete userCopy.password;
      req.user = userCopy;
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};
