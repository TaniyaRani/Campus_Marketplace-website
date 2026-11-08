import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Banknote, 
  Users, 
  PlusCircle, 
  ShoppingBag,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/products';
import { useMarketplace } from '../context/MarketplaceContext';

const Home = () => {
  const { products } = useMarketplace();

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background decorative glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* College Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ABES Engineering College Exclusive</span>
              <span className="text-white/40">|</span>
              <span className="text-amber-300">Fall / Winter 2026 Season</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              Buy & Sell Inside Campus. <br />
              <span className="bg-gradient-to-r from-amber-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                Save Big. Pass It Forward.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Why pay retail price in Nehru Nagar or Crossings? Trade engineering books, mini-drafters, hostel coolers, bicycles, and lab coats directly with fellow ABESians.
            </p>

            {/* Search Bar Container */}
            <div className="max-w-2xl mx-auto pt-2">
              <SearchBar />
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/products"
                className="px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/add-product"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 border border-indigo-400/40"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell an Item</span>
              </Link>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/10 max-w-4xl mx-auto text-left">
              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">100% Verified</h4>
                  <p className="text-[11px] text-slate-400">@abes.ac.in emails</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Brokerage</h4>
                  <p className="text-[11px] text-slate-400">Free student peer trade</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">5-Min Delivery</h4>
                  <p className="text-[11px] text-slate-400">Meet right on campus</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Active Community</h4>
                  <p className="text-[11px] text-slate-400">All 4 B.Tech batches</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Explore Categories
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Find essentials tailored for engineering students</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Featured Campus Deals
                </h2>
                <p className="text-xs text-slate-500">Handpicked high-value items from top rated seniors</p>
              </div>
            </div>
            <Link
              to="/products"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added Products Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Recently Added by ABES Students
              </h2>
              <p className="text-xs text-slate-500">Fresh listings posted in the last 24-48 hours</p>
            </div>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>See more items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it Works / Campus Safety Infographic */}
      <section className="py-14 bg-gradient-to-r from-indigo-50 to-blue-50 border-y border-indigo-100/70 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-black text-slate-900">How CampusCart Works</h2>
            <p className="text-xs text-slate-600 mt-1">Simple 3-step peer-to-peer exchange right in Ghaziabad campus</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Post in 60 Seconds</h3>
              <p className="text-xs text-slate-500">
                Snap a photo of your semester textbook, drafter, cooler, or cycle. Set your price and specify your hostel or block.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Chat Direct With Buyers</h3>
              <p className="text-xs text-slate-500">
                Discuss condition and negotiate via our built-in campus chat. No personal phone number sharing required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Meet at Canteen or Gate</h3>
              <p className="text-xs text-slate-500">
                Hand over the item at Central Cafeteria, BH/GH reception, or Library Lawn. Instant payment via UPI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to declutter your hostel room?</h3>
            <p className="text-xs sm:text-sm text-indigo-100">
              Your junior is looking for that exact Engineering Mechanics book or Drafter. List it now for free!
            </p>
          </div>
          <Link
            to="/add-product"
            className="px-6 py-3.5 rounded-xl bg-white text-indigo-700 hover:bg-slate-50 font-bold text-xs sm:text-sm shadow-lg whitespace-nowrap transition-transform hover:scale-105"
          >
            List an Item Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
