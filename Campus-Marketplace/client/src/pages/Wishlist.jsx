import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useMarketplace } from '../context/MarketplaceContext';

const Wishlist = () => {
  const { wishlist, products } = useMarketplace();

  const savedProducts = products.filter(p => wishlist.includes(p.id) || wishlist.includes(p._id));

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>Saved Campus Favorites</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Wishlist ({savedProducts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of calculators, books, and hostel supplies you plan to purchase.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-indigo-600 shadow-sm self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Discover More Items</span>
        </Link>
      </div>

      {/* Grid of Wishlist Items */}
      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Your wishlist is currently empty</h3>
          <p className="text-xs text-slate-500 mt-1">
            Found an interesting deal on campus? Tap the heart icon on any product card to save it for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <span>Explore Campus Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

    </div>
  );
};

export default Wishlist;
