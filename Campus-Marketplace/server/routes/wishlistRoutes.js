const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/toggle/:productId', toggleWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
