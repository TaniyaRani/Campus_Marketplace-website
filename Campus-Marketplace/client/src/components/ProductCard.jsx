import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

const conditionColors = {
  'Brand New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Like New': 'bg-blue-50 text-blue-700 border-blue-200',
  'Good': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Fair': 'bg-amber-50 text-amber-700 border-amber-200',
};

const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useMarketplace();
  const navigate = useNavigate();

  const isSaved = isWishlisted(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80';
            }}
          />
        </Link>

        {/* Condition Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shadow-sm backdrop-blur-md ${conditionColors[product.condition] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {product.condition}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-md transition-all duration-200 ${
            isSaved
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-110'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Views counter overlay */}
        <div className="absolute bottom-2 right-2 bg-slate-900/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium text-white flex items-center space-x-1">
          <Eye className="w-3 h-3" />
          <span>{product.views || 1}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Location */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="capitalize font-semibold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <span className="flex items-center text-slate-400 line-clamp-1 max-w-[130px]" title={product.location}>
              <MapPin className="w-3 h-3 mr-0.5 flex-shrink-0 text-slate-400" />
              {product.location?.split(',')[0]}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug" title={product.title}>
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Seller details */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            
            {/* Seller micro info */}
            <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-1">
              <span className="font-medium text-slate-700 truncate max-w-[90px]">{product.seller?.name}</span>
              <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" title="Verified ABES Student" />
              <span className="text-slate-300">•</span>
              <span className="text-[10px] text-slate-400">{product.seller?.year}</span>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition-all flex items-center space-x-1"
          >
            <span>Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
