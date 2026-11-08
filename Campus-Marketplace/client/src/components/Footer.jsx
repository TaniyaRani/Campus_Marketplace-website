import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  HelpCircle, 
  Heart, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Safety Banner */}
        <div className="mb-12 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Campus Safety & Trading Protocol</h4>
              <p className="text-xs text-slate-400">
                Always meet inside ABES campus grounds (Central Canteen, Bhabha Library Lawn, or Main Gate Security). Test gadgets before UPI transfer.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/30 whitespace-nowrap">
            ABES Student Safe Zone
          </span>
        </div>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Campus<span className="text-indigo-400">Cart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The exclusive peer-to-peer exchange for ABES Engineering College students. Buy, sell, and pass down books, mini-drafters, hostel furniture, electronics, and lab equipment securely with campus peers.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Restricted strictly to @abes.ac.in domain users</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Marketplace</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=books" className="text-slate-400 hover:text-white transition-colors">
                  Books & Notes
                </Link>
              </li>
              <li>
                <Link to="/products?category=engineering" className="text-slate-400 hover:text-white transition-colors">
                  Engineering Kits & Drafters
                </Link>
              </li>
              <li>
                <Link to="/products?category=cycles" className="text-slate-400 hover:text-white transition-colors">
                  Bicycles & Mobility
                </Link>
              </li>
              <li>
                <Link to="/products?category=hostel" className="text-slate-400 hover:text-white transition-colors">
                  Hostel Coolers & Kettles
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Student Center</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/add-product" className="text-slate-400 hover:text-white transition-colors">
                  Post a Free Ad
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="text-slate-400 hover:text-white transition-colors">
                  My Active Listings
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-slate-400 hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-slate-400 hover:text-white transition-colors">
                  Buyer-Seller Chats
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-400 hover:text-white transition-colors">
                  Student Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* College Campus Address */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Campus Spot</h5>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>ABES Engineering College, 19th KM Stone, NH-09, Ghaziabad, UP 201009</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>marketplace@abes.ac.in</span>
              </p>
              <div className="pt-2">
                <a 
                  href="https://abes.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 text-xs font-medium"
                >
                  <span>Official College Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusCart ABES. Developed for student welfare.</p>
          <div className="flex items-center space-x-6">
            <span>Student-Run Non-Profit Initiative</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for ABESians</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
