const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAllProductsAdmin,
  updateProductStatusAdmin,
  deleteProductAdmin,
  getAdminStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');

// All Admin routes require valid JWT and admin role
router.use(protect);
router.use(authorizeAdmin);

// Dashboard stats
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Product Listings Management
router.get('/products', getAllProductsAdmin);
router.put('/products/:id/status', updateProductStatusAdmin);
router.delete('/products/:id', deleteProductAdmin);

module.exports = router;
