const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { getMemoryProducts } = require('./productController');

const isDbConnected = () => mongoose.connection.readyState === 1;

// In-memory wishlist mapping: userId -> array of productIds
let memoryWishlists = {
  'user-abes-1': ['prod-1', 'prod-3']
};

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      let wishlist = await Wishlist.findOne({ user: userId }).populate({
        path: 'products',
        populate: {
          path: 'seller',
          select: 'name email department year hostel phone rating avatar'
        }
      });

      if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
      }

      return res.status(200).json({
        success: true,
        count: wishlist.products.length,
        productIds: wishlist.products.map((p) => (p._id || p).toString()),
        data: wishlist.products
      });
    }

    // In-memory fallback
    const userWishlistIds = memoryWishlists[userId] || [];
    const allProducts = getMemoryProducts();
    const wishlistedProducts = allProducts.filter(p =>
      userWishlistIds.includes(p._id) || userWishlistIds.includes(p.id)
    );

    return res.status(200).json({
      success: true,
      count: wishlistedProducts.length,
      productIds: userWishlistIds,
      data: wishlistedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found.`
        });
      }
      const productExists = await Product.findById(productId);
      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found.`
        });
      }

      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        wishlist = await Wishlist.create({
          user: userId,
          products: [productId]
        });
      } else {
        if (!wishlist.products.some((product) => product.toString() === productId)) {
          wishlist.products.push(productId);
          await wishlist.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Product added to wishlist successfully!',
        data: wishlist.products
      });
    }

    // In-memory fallback
    if (!getMemoryProducts().some((product) => product.id === productId || product._id === productId)) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found.`
      });
    }
    if (!memoryWishlists[userId]) {
      memoryWishlists[userId] = [];
    }

    if (!memoryWishlists[userId].includes(productId)) {
      memoryWishlists[userId].push(productId);
    }

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully!',
      data: memoryWishlists[userId]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      let wishlist = await Wishlist.findOne({ user: userId });
      if (wishlist) {
        wishlist.products = wishlist.products.filter(
          p => p.toString() !== productId
        );
        await wishlist.save();
      }

      return res.status(200).json({
        success: true,
        message: 'Product removed from wishlist.',
        data: wishlist ? wishlist.products : []
      });
    }

    // In-memory fallback
    if (memoryWishlists[userId]) {
      memoryWishlists[userId] = memoryWishlists[userId].filter(id => id !== productId);
    }

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      data: memoryWishlists[userId] || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product in wishlist (Add if not present, Remove if present)
// @route   POST /api/wishlist/toggle/:productId
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      if (!mongoose.Types.ObjectId.isValid(productId) || !await Product.exists({ _id: productId })) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found.`
        });
      }
      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        wishlist = await Wishlist.create({
          user: userId,
          products: [productId]
        });
        return res.status(200).json({
          success: true,
          isWishlisted: true,
          message: 'Product added to wishlist!',
          data: wishlist.products
        });
      }

      const stringIds = wishlist.products.map(p => p.toString());
      let isWishlisted;

      if (stringIds.includes(productId)) {
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        isWishlisted = false;
      } else {
        wishlist.products.push(productId);
        isWishlisted = true;
      }

      await wishlist.save();

      return res.status(200).json({
        success: true,
        isWishlisted,
        message: isWishlisted ? 'Product added to wishlist!' : 'Product removed from wishlist.',
        data: wishlist.products
      });
    }

    // In-memory fallback
    if (!memoryWishlists[userId]) {
      memoryWishlists[userId] = [];
    }

    if (!getMemoryProducts().some((product) => product.id === productId || product._id === productId)) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${productId} not found.`
      });
    }

    let isWishlisted;
    if (memoryWishlists[userId].includes(productId)) {
      memoryWishlists[userId] = memoryWishlists[userId].filter(id => id !== productId);
      isWishlisted = false;
    } else {
      memoryWishlists[userId].push(productId);
      isWishlisted = true;
    }

    return res.status(200).json({
      success: true,
      isWishlisted,
      message: isWishlisted ? 'Product added to wishlist!' : 'Product removed from wishlist.',
      data: memoryWishlists[userId]
    });
  } catch (error) {
    next(error);
  }
};
