const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings,
  searchProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Public search
router.get('/search', searchProducts);

// Protected: Get user's own listings (placed before /:id to avoid collision)
router.get('/my/listings', protect, getMyListings);

// Base products route
router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

// Single product routes
router
  .route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
