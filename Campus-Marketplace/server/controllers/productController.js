const mongoose = require('mongoose');
const Product = require('../models/Product');
const Wishlist = require('../models/Wishlist');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Initial sample data for in-memory development mode
let memoryProducts = [
  {
    _id: 'prod-1',
    id: 'prod-1',
    title: 'Casio FX-991EX Classwiz Scientific Calculator',
    description: 'High-speed scientific calculator in mint condition. Perfect for Engineering Mathematics, EE, and GATE preparation. All buttons smooth, comes with slide-on hard case and fresh battery.',
    price: 850,
    originalPrice: 1595,
    category: 'engineering',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80'
    ],
    seller: 'user-abes-1',
    sellerInfo: {
      id: 'user-abes-1',
      name: 'Aryan Sharma',
      email: 'aryan.21b0101001@abes.ac.in',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      hostel: 'Aryabhatta Boys Hostel (BH-2)',
      rating: 4.9,
      phone: '+91 98765 43210',
      verifiedStudent: true
    },
    location: 'BH-2 Room 314, ABES Campus',
    isFeatured: true,
    status: 'active',
    views: 142,
    createdAt: new Date('2026-11-04T10:30:00.000Z').toISOString(),
    updatedAt: new Date('2026-11-04T10:30:00.000Z').toISOString()
  },
  {
    _id: 'prod-2',
    id: 'prod-2',
    title: 'Omega Mini Drafter with Cover & Steel Clips',
    description: 'Engineering Graphics & Design mini drafter with dual scale. Essential for 1st & 2nd semester mechanical drawing. Smooth knob rotation and crack-free transparent ruler arms.',
    price: 320,
    originalPrice: 750,
    category: 'stationery',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=80'
    ],
    seller: 'user-abes-2',
    sellerInfo: {
      id: 'user-abes-2',
      name: 'Priya Verma',
      email: 'priya.22b0201045@abes.ac.in',
      department: 'Information Technology',
      year: '2nd Year',
      hostel: 'Kalpana Chawla Girls Hostel (GH-1)',
      rating: 4.8,
      phone: '+91 97654 32109',
      verifiedStudent: true
    },
    location: 'GH-1 Reception, ABES Ghaziabad',
    isFeatured: true,
    status: 'active',
    views: 98,
    createdAt: new Date('2026-11-03T14:15:00.000Z').toISOString(),
    updatedAt: new Date('2026-11-03T14:15:00.000Z').toISOString()
  },
  {
    _id: 'prod-3',
    id: 'prod-3',
    title: 'Hero Sprint 21-Speed Mountain Gear Bicycle',
    description: 'Black & orange cycle with dual disc brakes, front suspension, and water bottle holder. Used for daily commuting to campus and Crossings Republik. Fully tuned up last week.',
    price: 3800,
    originalPrice: 8900,
    category: 'cycles',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80'
    ],
    seller: 'user-abes-3',
    sellerInfo: {
      id: 'user-abes-3',
      name: 'Rohan Gupta',
      email: 'rohan.20b0301089@abes.ac.in',
      department: 'Mechanical Engineering',
      year: '4th Year',
      hostel: 'Day Scholar (Lal Kuan)',
      rating: 5.0,
      phone: '+91 96543 21098',
      verifiedStudent: true
    },
    location: 'Main Gate Parking, ABES Engineering College',
    isFeatured: true,
    status: 'active',
    views: 265,
    createdAt: new Date('2026-11-05T08:00:00.000Z').toISOString(),
    updatedAt: new Date('2026-11-05T08:00:00.000Z').toISOString()
  },
  {
    _id: 'prod-4',
    id: 'prod-4',
    title: 'Symphony Personal Room Cooler (Hostel Approved)',
    description: '20L water tank honeycomb pad cooler with i-Pure multi-stage air purification. Super low power consumption, quiet operation, perfect for hostel summer semesters. Clean and ready to use.',
    price: 1950,
    originalPrice: 5499,
    category: 'hostel',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ],
    seller: 'user-abes-4',
    sellerInfo: {
      id: 'user-abes-4',
      name: 'Aditya Srivastava',
      email: 'aditya.21b0102112@abes.ac.in',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      hostel: 'Ramanujan Hostel (BH-3)',
      rating: 4.7,
      phone: '+91 95432 10987',
      verifiedStudent: true
    },
    location: 'BH-3 Common Hall, ABES Campus',
    isFeatured: true,
    status: 'active',
    views: 184,
    createdAt: new Date('2026-11-04T18:45:00.000Z').toISOString(),
    updatedAt: new Date('2026-11-04T18:45:00.000Z').toISOString()
  },
  {
    _id: 'prod-5',
    id: 'prod-5',
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    description: 'The Bible of Data Structures & Algorithms by Cormen, Leiserson, Rivest, Stein. Genuine PHI edition, no torn pages, minimal pencil markings in dynamic programming chapters.',
    price: 490,
    originalPrice: 1250,
    category: 'books',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
    ],
    seller: 'user-abes-1',
    sellerInfo: {
      id: 'user-abes-1',
      name: 'Aryan Sharma',
      email: 'aryan.21b0101001@abes.ac.in',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      hostel: 'Aryabhatta Boys Hostel (BH-2)',
      rating: 4.9,
      phone: '+91 98765 43210',
      verifiedStudent: true
    },
    location: 'Bhabha Block Library Area, ABES Ghaziabad',
    isFeatured: false,
    status: 'active',
    views: 112,
    createdAt: new Date('2026-11-05T09:10:00.000Z').toISOString(),
    updatedAt: new Date('2026-11-05T09:10:00.000Z').toISOString()
  }
];

// Seed memory products getter
exports.getMemoryProducts = () => memoryProducts;

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      minPrice,
      maxPrice,
      seller,
      status = 'active',
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    if (isDbConnected()) {
      let query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (category && category !== 'all') {
        query.category = category;
      }

      if (condition && condition !== 'all') {
        query.condition = condition;
      }

      if (seller) {
        query.seller = seller;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { description: regex },
          { category: regex },
          { location: regex }
        ];
      }

      // Sort logic
      let sortOption = { createdAt: -1 };
      if (sort === 'price_low') sortOption = { price: 1 };
      else if (sort === 'price_high') sortOption = { price: -1 };
      else if (sort === 'oldest') sortOption = { createdAt: 1 };
      else if (sort === 'most_viewed') sortOption = { views: -1 };

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const skip = (pageNum - 1) * limitNum;

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .populate('seller', 'name email department year hostel phone rating avatar verifiedStudent')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        data: products
      });
    }

    // --- In-Memory Fallback ---
    let results = [...memoryProducts];

    if (status && status !== 'all') {
      results = results.filter(p => p.status === status);
    }

    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (condition && condition !== 'all') {
      results = results.filter(p => p.condition.toLowerCase() === condition.toLowerCase());
    }

    if (seller) {
      results = results.filter(p => (p.seller === seller || p.sellerInfo?.id === seller));
    }

    if (minPrice) {
      results = results.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      results = results.filter(p => p.price <= Number(maxPrice));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sort === 'price_low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'oldest') {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'most_viewed') {
      results.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const startIdx = (pageNum - 1) * limitNum;
    const paginated = results.slice(startIdx, startIdx + limitNum);

    return res.status(200).json({
      success: true,
      count: paginated.length,
      total: results.length,
      page: pageNum,
      totalPages: Math.ceil(results.length / limitNum) || 1,
      data: paginated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID (increments views)
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      ).populate('seller', 'name email department year hostel phone rating avatar verifiedStudent');

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found with ID ${id}`
        });
      }

      return res.status(200).json({
        success: true,
        data: product
      });
    }

    // In-memory lookup
    const product = memoryProducts.find(p => p._id === id || p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID ${id}`
      });
    }

    product.views = (product.views || 0) + 1;

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Add new product listing
// @route   POST /api/products
// @access  Private (Logged-in Student / Admin)
exports.createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      condition,
      images,
      location,
      isFeatured
    } = req.body;

    // Validation
    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, price, and category for the product.'
      });
    }

    const sellerId = req.user.id || req.user._id;
    const sellerInfo = {
      id: sellerId,
      name: req.user.name || 'ABES Student',
      email: req.user.email,
      department: req.user.department || 'Computer Science & Engineering',
      year: req.user.year || '3rd Year',
      hostel: req.user.hostel || 'Hostel / Day Scholar',
      phone: req.user.phone || '+91 99999 88888',
      rating: req.user.rating || 5.0,
      avatar: req.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      verifiedStudent: req.user.verifiedStudent ?? true
    };

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(sellerId)) {
      const newProduct = await Product.create({
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : 0,
        category: category.toLowerCase(),
        condition: condition || 'Good',
        images: images && images.length > 0 ? images : [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
        ],
        seller: sellerId,
        sellerInfo,
        location: location || 'ABES Engineering College, Ghaziabad',
        isFeatured: Boolean(isFeatured),
        status: 'active',
        views: 0
      });

      return res.status(201).json({
        success: true,
        message: 'Product listed successfully!',
        data: newProduct
      });
    }

    // In-memory fallback
    const newId = `prod-${Date.now()}`;
    const newProduct = {
      _id: newId,
      id: newId,
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      category: category.toLowerCase(),
      condition: condition || 'Good',
      images: images && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
      ],
      seller: sellerId,
      sellerInfo,
      location: location || 'ABES Engineering College, Ghaziabad',
      isFeatured: Boolean(isFeatured),
      status: 'active',
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    memoryProducts.unshift(newProduct);

    return res.status(201).json({
      success: true,
      message: 'Product listed successfully!',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner or Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user.id || req.user._id).toString();
    const isAdmin = req.user.role === 'admin';

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      let product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found with ID ${id}`
        });
      }

      // Check ownership
      if (product.seller.toString() !== currentUserId && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this listing.'
        });
      }

      const updateData = { ...req.body };
      delete updateData.seller; // Prevent changing owner
      delete updateData._id;

      product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      });

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully!',
        data: product
      });
    }

    // In-memory fallback
    const index = memoryProducts.findIndex(p => p._id === id || p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID ${id}`
      });
    }

    const product = memoryProducts[index];
    const sellerId = product.seller || product.sellerInfo?.id;

    if (sellerId !== currentUserId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing.'
      });
    }

    const updated = {
      ...product,
      ...req.body,
      _id: product._id,
      id: product.id,
      seller: product.seller,
      sellerInfo: product.sellerInfo,
      updatedAt: new Date().toISOString()
    };

    memoryProducts[index] = updated;

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner or Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = (req.user.id || req.user._id).toString();
    const isAdmin = req.user.role === 'admin';

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found with ID ${id}`
        });
      }

      if (product.seller.toString() !== currentUserId && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this listing.'
        });
      }

      await Product.findByIdAndDelete(id);

      // Clean up from Wishlists
      await Wishlist.updateMany({}, { $pull: { products: id } });

      return res.status(200).json({
        success: true,
        message: 'Product listing deleted successfully.'
      });
    }

    // In-memory fallback
    const index = memoryProducts.findIndex(p => p._id === id || p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID ${id}`
      });
    }

    const product = memoryProducts[index];
    const sellerId = product.seller || product.sellerInfo?.id;

    if (sellerId !== currentUserId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing.'
      });
    }

    memoryProducts.splice(index, 1);

    return res.status(200).json({
      success: true,
      message: 'Product listing deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings created by current logged-in user
// @route   GET /api/products/my/listings
// @access  Private
exports.getMyListings = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      const listings = await Product.find({ seller: userId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: listings.length,
        data: listings
      });
    }

    // In-memory fallback
    const listings = memoryProducts.filter(
      p => (p.seller === userId || p.sellerInfo?.id === userId)
    );

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const queryTerm = q.trim();

    if (!queryTerm) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    if (isDbConnected()) {
      const regex = new RegExp(queryTerm, 'i');
      const products = await Product.find({
        status: 'active',
        $or: [
          { title: regex },
          { description: regex },
          { category: regex },
          { location: regex }
        ]
      })
        .limit(15)
        .select('title price originalPrice category condition images views location');

      return res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    }

    // In-memory
    const term = queryTerm.toLowerCase();
    const matched = memoryProducts
      .filter(
        p =>
          p.status === 'active' &&
          (p.title.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            (p.location && p.location.toLowerCase().includes(term)))
      )
      .slice(0, 15);

    return res.status(200).json({
      success: true,
      count: matched.length,
      data: matched
    });
  } catch (error) {
    next(error);
  }
};
