import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  Phone, 
  Share2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Tag, 
  Sparkles, 
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Eye,
  CornerDownRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, isWishlisted, toggleWishlist, startChatWithSeller, showToast } = useMarketplace();
  const { currentUser } = useAuth();

  const product = products.find(p => p.id === id || p._id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Item Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            This product may have been marked as sold or removed by the student seller.
          </p>
          <Link
            to="/products"
            className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = isWishlisted(product.id || product._id);
  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
  ];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleStartChat = async () => {
    if (!currentUser) {
      showToast('Please log in with your ABES email to chat with seller', 'info');
      navigate('/login');
      return;
    }
    const chatId = await startChatWithSeller(product, product.seller);
    navigate('/chat', { state: { activeChatId: chatId } });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing link copied to clipboard!');
    }
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 p-2 rounded-xl bg-white border border-slate-200 shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Item</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {/* Condition Tag */}
            <div className="absolute top-4 left-4">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md shadow-sm border border-slate-200 text-indigo-700">
                Condition: {product.condition}
              </span>
            </div>

            {/* Quick Wishlist on Image */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-2xl shadow-md backdrop-blur-md transition-all ${
                isSaved ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Campus Safety Guide Callout */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Guidelines for In-Campus Trading</span>
            </div>
            <ul className="space-y-1 text-amber-800 list-disc list-inside">
              <li>Always schedule meets inside the ABES Campus (Canteen, Library lawn, or Hostel Gate).</li>
              <li>Inspect physical condition and functionality thoroughly before sending funds via UPI.</li>
              <li>Report any non-college commercial solicitations to the student marketplace council.</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Product Details & Seller Box */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
                <span className="flex items-center space-x-1 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Posted {new Date(product.createdAt).toLocaleDateString()}</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {product.title}
              </h1>

              <div className="flex items-center space-x-2 mt-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Pickup: {product.location}</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Offer Price</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {discountPercent > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold text-right">
                  <span>{discountPercent}% OFF Retail</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleStartChat}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact / Chat with Seller</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowPhoneModal(true)}
                  className="py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call / WhatsApp</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 border ${
                    isSaved
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{isSaved ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Item Description & Condition Notes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Seller Information Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Verified Student Seller
            </h3>

            <div className="flex items-center space-x-3.5">
              <img
                src={product.seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                alt={product.seller?.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {product.seller?.name}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" title="Verified ABES Student ID" />
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {product.seller?.department}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                  <span>{product.seller?.year}</span>
                  <span>•</span>
                  <span>{product.seller?.hostel}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-slate-800">{product.seller?.rating || '4.9'} / 5.0</span>
                <span className="text-amber-500">★</span>
                <span>Peer Rating</span>
              </div>
              <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                Active Student
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Seller Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Direct Student Contact</h3>
            <p className="text-xs text-slate-500">
              Please be polite and mention that you found their listing on <b>CampusCart</b>.
            </p>
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-900 font-mono font-bold text-center text-sm border border-indigo-100">
              {product.seller?.phone || '+91 98765 43210'}
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <a
                href={`tel:${product.seller?.phone || '+919876543210'}`}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center hover:bg-indigo-700"
              >
                Call Student
              </a>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">More in {product.category}</h2>
            <Link to={`/products?category=${product.category}`} className="text-xs font-bold text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
