import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  RotateCcw,
  PackageOpen,
  Sparkles
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { useMarketplace } from '../context/MarketplaceContext';

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair'];

const Products = () => {
  const { products } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search query / category query
  const queryParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'all';

  // State
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-asc', 'price-desc', 'featured'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with searchParams on load or URL change
  useEffect(() => {
    if (searchParams.get('search') !== null) {
      setSearchTerm(searchParams.get('search') || '');
    }
    if (searchParams.get('category') !== null) {
      setSelectedCategory(searchParams.get('category') || 'all');
    }
  }, [searchParams]);

  const toggleCondition = (cond) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedConditions([]);
    setPriceRange({ min: 0, max: 10000 });
    setSortBy('newest');
    setSearchParams({});
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search matching (title, description, seller, location)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = prod.title.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        const matchLoc = prod.location?.toLowerCase().includes(q);
        const matchCat = prod.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchLoc && !matchCat) return false;
      }

      // Category matching
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // Condition matching
      if (selectedConditions.length > 0 && !selectedConditions.includes(prod.condition)) {
        return false;
      }

      // Price range
      if (prod.price < priceRange.min || prod.price > priceRange.max) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      // 'newest' default
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [products, searchTerm, selectedCategory, selectedConditions, priceRange, sortBy]);

  const hasActiveFilters = 
    searchTerm || 
    selectedCategory !== 'all' || 
    selectedConditions.length > 0 || 
    priceRange.min > 0 || 
    priceRange.max < 10000;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner / Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Marketplace Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse through items posted by ABES Engineering College students.
          </p>
        </div>

        {/* Mobile Filter Toggle & Quick Stats */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filters ({selectedConditions.length + (selectedCategory !== 'all' ? 1 : 0)})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="newest">Recently Listed</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Filters Sidebar (Desktop + Mobile Drawer) */}
        <div className={`
          lg:block lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6
          ${mobileFilterOpen ? 'fixed inset-4 z-50 overflow-y-auto block' : 'hidden'}
        `}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Filter Listings</h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Search Query</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Keywords, books, room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>

              {CATEGORIES.map((cat) => {
                const count = products.filter(p => p.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">Price Budget (₹)</label>
              <span className="text-xs font-extrabold text-indigo-600">
                Up to ₹{priceRange.max.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>₹100</span>
              <span>₹5,000</span>
              <span>₹10,000+</span>
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Item Condition</label>
            <div className="space-y-2">
              {CONDITIONS.map((cond) => {
                const checked = selectedConditions.includes(cond);
                return (
                  <label
                    key={cond}
                    className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none hover:text-slate-900"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCondition(cond)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{cond}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Mobile apply button */}
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="lg:hidden w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Show {filteredProducts.length} Results
          </button>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3">
          {/* Active chips bar */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing <b className="text-slate-900">{filteredProducts.length}</b> verified items on campus
            </span>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No matching items found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Try loosening your filters or search terms. ABES students post new items regularly!
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Products;
