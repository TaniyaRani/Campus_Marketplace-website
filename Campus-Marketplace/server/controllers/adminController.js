const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');
const { getMemoryUsers } = require('./authController');
const { getMemoryProducts } = require('./productController');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all users (with search and status filters)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status, department } = req.query;

    if (isDbConnected()) {
      let query = {};

      if (role && role !== 'all') {
        query.role = role;
      }
      if (status && status !== 'all') {
        query.status = status;
      }
      if (department && department !== 'all') {
        query.department = department;
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { name: regex },
          { email: regex },
          { rollNumber: regex },
          { department: regex }
        ];
      }

      const users = await User.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    }

    // In-memory fallback
    let users = getMemoryUsers();

    if (role && role !== 'all') {
      users = users.filter(u => u.role === role);
    }
    if (status && status !== 'all') {
      users = users.filter(u => u.status === status);
    }
    if (department && department !== 'all') {
      users = users.filter(u => u.department === department);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      users = users.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.rollNumber && u.rollNumber.toLowerCase().includes(q))
      );
    }

    const sanitizedUsers = users.map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });

    return res.status(200).json({
      success: true,
      count: sanitizedUsers.length,
      data: sanitizedUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (active / suspended)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (status && !['active', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user status required: active or suspended.'
      });
    }

    const currentAdminId = (req.user.id || req.user._id).toString();
    if (id === currentAdminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot suspend their own account.'
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${id} not found.`
        });
      }

      // If status provided, set it; otherwise toggle
      user.status = status || (user.status === 'active' ? 'suspended' : 'active');
      await user.save();

      return res.status(200).json({
        success: true,
        message: `User status changed to ${user.status}`,
        data: user
      });
    }

    // In-memory fallback
    const users = getMemoryUsers();
    const user = users.find(u => u._id === id || u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`
      });
    }

    user.status = status || (user.status === 'active' ? 'suspended' : 'active');

    return res.status(200).json({
      success: true,
      message: `User status changed to ${user.status}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (student / admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (role && !['student', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid user role required: student or admin.'
      });
    }

    const currentAdminId = (req.user.id || req.user._id).toString();
    if (id === currentAdminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot alter their own role.'
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${id} not found.`
        });
      }

      user.role = role || (user.role === 'admin' ? 'student' : 'admin');
      await user.save();

      return res.status(200).json({
        success: true,
        message: `User role changed to ${user.role}`,
        data: user
      });
    }

    // In-memory fallback
    const users = getMemoryUsers();
    const user = users.find(u => u._id === id || u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`
      });
    }

    user.role = role || (user.role === 'admin' ? 'student' : 'admin');

    return res.status(200).json({
      success: true,
      message: `User role changed to ${user.role}`,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentAdminId = (req.user.id || req.user._id).toString();

    if (id === currentAdminId) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account.'
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${id} not found.`
        });
      }

      await User.findByIdAndDelete(id);
      await Product.deleteMany({ seller: id });
      await Wishlist.deleteOne({ user: id });

      return res.status(200).json({
        success: true,
        message: 'User and their listings deleted successfully.'
      });
    }

    // In-memory fallback
    const users = getMemoryUsers();
    const idx = users.findIndex(u => u._id === id || u.id === id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`
      });
    }

    users.splice(idx, 1);

    return res.status(200).json({
      success: true,
      message: 'User and their listings deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all product listings for Admin (including inactive & suspended)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (category && category !== 'all') {
        query.category = category;
      }
      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { description: regex }
        ];
      }

      const products = await Product.find(query)
        .populate('seller', 'name email department year rollNumber')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    }

    // In-memory fallback
    let products = getMemoryProducts();

    if (status && status !== 'all') {
      products = products.filter(p => p.status === status);
    }
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(
        p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product status by Admin (active / suspended / sold / inactive)
// @route   PUT /api/admin/products/:id/status
// @access  Private/Admin
exports.updateProductStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'sold', 'reserved', 'suspended', 'inactive'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Valid status required: ${validStatuses.join(', ')}`
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Product status updated to ${status}`,
        data: product
      });
    }

    // In-memory fallback
    const products = getMemoryProducts();
    const product = products.find(p => p._id === id || p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`
      });
    }

    product.status = status;
    product.updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: `Product status updated to ${status}`,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Delete Product Listing
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProductAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found.`
        });
      }

      await Wishlist.updateMany({}, { $pull: { products: id } });

      return res.status(200).json({
        success: true,
        message: 'Product removed by campus administrator.'
      });
    }

    // In-memory fallback
    const products = getMemoryProducts();
    const idx = products.findIndex(p => p._id === id || p.id === id);

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`
      });
    }

    products.splice(idx, 1);

    return res.status(200).json({
      success: true,
      message: 'Product removed by campus administrator.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Admin Metrics and Overview
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const [
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalProducts,
        activeProducts,
        soldProducts,
        suspendedProducts
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ status: 'active' }),
        User.countDocuments({ status: 'suspended' }),
        Product.countDocuments(),
        Product.countDocuments({ status: 'active' }),
        Product.countDocuments({ status: 'sold' }),
        Product.countDocuments({ status: 'suspended' })
      ]);

      return res.status(200).json({
        success: true,
        stats: {
          users: {
            total: totalUsers,
            active: activeUsers,
            suspended: suspendedUsers
          },
          products: {
            total: totalProducts,
            active: activeProducts,
            sold: soldProducts,
            suspended: suspendedProducts
          }
        }
      });
    }

    // In-memory fallback
    const users = getMemoryUsers();
    const products = getMemoryProducts();

    return res.status(200).json({
      success: true,
      stats: {
        users: {
          total: users.length,
          active: users.filter(u => u.status === 'active').length,
          suspended: users.filter(u => u.status === 'suspended').length
        },
        products: {
          total: products.length,
          active: products.filter(p => p.status === 'active').length,
          sold: products.filter(p => p.status === 'sold').length,
          suspended: products.filter(p => p.status === 'suspended').length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
