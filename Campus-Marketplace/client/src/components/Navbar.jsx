import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { wishlist, chats } = useMarketplace();
  const [searchInput, setSearchInput] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const totalUnreadChats = chats.reduce((acc, c) => acc + (c.unread || 0), 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-indigo-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-400 text-amber-950">
              ABES EC
            </span>
            <span className="hidden sm:inline">Official Student Peer-to-Peer Marketplace</span>
            <span className="sm:hidden">ABES Student Marketplace</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified College IDs Only
            </span>
            <span className="hidden md:inline text-indigo-300">Campus Delivery • 0% Commission</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Campus<span className="text-indigo-600">Cart</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  ABES
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 -mt-0.5">Ghaziabad Student Hub</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-lg items-center relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search drafters, calculators, cycles, coolers, books..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-24 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-indigo-400 rounded-full outline-none transition-all duration-200 placeholder:text-slate-400 text-slate-800 focus:ring-4 focus:ring-indigo-100"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-full transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Navigation Links & Actions */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/products" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/products' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              Explore Store
            </Link>
            <Link 
              to="/products?category=hostel" 
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Hostel Needs
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`text-sm font-semibold flex items-center space-x-1 px-2.5 py-1 rounded-md transition-colors ${
                  location.pathname === '/admin' ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-3">
            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Chat Icon */}
            <Link 
              to="/chat" 
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="Student Chats"
            >
              <MessageSquare className="w-5 h-5" />
              {totalUnreadChats > 0 && (
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalUnreadChats}
                </span>
              )}
            </Link>

            {/* Post Ad Button */}
            <Link
              to="/add-product"
              className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Product</span>
            </Link>

            {/* User Profile / Login Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <span className="hidden xl:inline text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {currentUser.department?.split(' ')[0] || 'ABES'} • {currentUser.year}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Student Profile</span>
                    </Link>

                    <Link
                      to="/my-listings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>My Listed Products</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span>Saved Items ({wishlist.length})</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-xs text-amber-700 bg-amber-50/50 hover:bg-amber-100/70 transition-colors font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-slate-900 hover:bg-indigo-600 text-white px-3.5 py-1.5 rounded-xl transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar row */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search campus items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 rounded-xl outline-none placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-lg"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Explore All Products
          </Link>
          <Link
            to="/add-product"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 py-2 text-sm font-semibold text-indigo-600"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Product on Campus</span>
          </Link>
          <Link
            to="/my-listings"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            My Listed Products
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Wishlist ({wishlist.length})
          </Link>
          <Link
            to="/chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Chat Messages
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-amber-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
