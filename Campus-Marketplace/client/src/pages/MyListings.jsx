import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

const MyListings = () => {
  const { products, deleteProduct, updateProduct } = useMarketplace();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter listings belonging to the current user
  const myListings = products.filter(p => {
    const pSellerId = p.seller?.id || p.seller?._id || p.seller;
    const currentId = currentUser?.id || currentUser?._id;
    return (
      (pSellerId && currentId && String(pSellerId) === String(currentId)) ||
      (p.seller?.email && currentUser?.email && p.seller.email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser?.email?.includes('aryan') && (pSellerId === 'user-abes-1' || p.seller?.id === 'user-abes-1'))
    );
  });

  const totalValue = myListings.reduce((sum, item) => sum + item.price, 0);
  const totalViews = myListings.reduce((sum, item) => sum + (item.views || 0), 0);

  const handleToggleSold = (item) => {
    const nextStatus = item.status === 'sold' ? 'active' : 'sold';
    updateProduct(item.id, { status: nextStatus });
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteProduct(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Campus Listings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your items for sale, update prices, mark as sold, or delete listings.
          </p>
        </div>
        <Link
          to="/add-product"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Active Items</span>
            <p className="text-2xl font-black text-slate-900">{myListings.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Inventory Worth</span>
            <p className="text-2xl font-black text-slate-900">₹{totalValue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Student Inquiries / Views</span>
            <p className="text-2xl font-black text-slate-900">{totalViews}</p>
          </div>
        </div>
      </div>

      {/* Listings Table / Cards */}
      {myListings.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Your Active & Completed Posts</h2>
            <span className="text-xs text-slate-400">{myListings.length} total entries</span>
          </div>

          <div className="divide-y divide-slate-100">
            {myListings.map((item) => (
              <div 
                key={item.id} 
                className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                {/* Left: Image & Info */}
                <div className="flex items-center space-x-4 min-w-0">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'sold'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.status === 'sold' ? 'Sold Out' : 'Active on Campus'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1 truncate">
                      {item.title}
                    </h3>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="font-extrabold text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        <span>{item.views || 0} views</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleSold(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      item.status === 'sold'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {item.status === 'sold' ? 'Relist Item' : 'Mark as Sold'}
                  </button>

                  <Link
                    to={`/product/${item.id}`}
                    className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors"
                    title="View Public Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/edit-product/${item.id}`}
                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors"
                    title="Edit Listing"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You haven't listed any items yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Have old drafters, hostel electronics, or semester 1-4 textbooks? Post them in 60 seconds!
          </p>
          <Link
            to="/add-product"
            className="inline-flex items-center space-x-1.5 mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post First Item</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Listing?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <b>"{itemToDelete.title}"</b>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Yes, Delete
              </button>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyListings;
