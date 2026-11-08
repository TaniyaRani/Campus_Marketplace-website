import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  Users, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Search, 
  DollarSign, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { 
    products, 
    usersList, 
    adminStats,
    adminDeleteProduct, 
    adminSetProductStatus, 
    toggleUserStatus, 
    toggleUserRole 
  } = useMarketplace();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products', 'users', 'safety'
  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const totalMarketplaceValue = products.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.seller?.name.toLowerCase().includes(q);
  });

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Admin Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>ABES Campus Administration Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Marketplace Moderation Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <b className="text-slate-800">{currentUser?.name}</b> ({currentUser?.email})
          </p>
        </div>

        {/* Tab switch pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Moderation ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Accounts ({usersList.length})
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Total Listings</span>
            <p className="text-2xl font-black text-slate-900">{adminStats?.products?.total ?? products.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Market Circulation</span>
            <p className="text-2xl font-black text-slate-900">₹{totalMarketplaceValue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Active Listings</span>
            <p className="text-2xl font-black text-slate-900">{adminStats?.products?.active ?? products.filter((p) => p.status === 'active').length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Suspended Accounts</span>
            <p className="text-2xl font-black text-slate-900">{adminStats?.users?.suspended ?? usersList.filter((u) => u.status === 'suspended').length}</p>
          </div>
        </div>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header & Search */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Manage Campus Product Listings</h2>
              <p className="text-xs text-slate-400">Review, flag, or remove student ads across all categories</p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search products or sellers..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Product Item</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Price</th>
                  <th className="py-3 px-6">Student Seller</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id || p._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <Link 
                            to={`/product/${p.id}`} 
                            className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1 flex items-center space-x-1"
                          >
                            <span>{p.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 inline" />
                          </Link>
                          <span className="text-[11px] text-slate-400 block">{p.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 capitalize font-semibold text-slate-600">
                      {p.category}
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{p.seller?.name}</div>
                      <div className="text-[11px] text-slate-400">{p.seller?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : p.status === 'suspended'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {p.status || 'active'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        {p.status !== 'active' ? (
                          <button
                            onClick={() => adminSetProductStatus(p.id || p._id, 'active')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-bold text-[11px] border border-emerald-200"
                            title="Approve Listing"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => adminSetProductStatus(p.id || p._id, 'suspended')}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-bold text-[11px] border border-amber-200"
                            title="Suspend Listing"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => adminDeleteProduct(p.id || p._id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Listing permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Header & Search */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Registered Student Accounts</h2>
              <p className="text-xs text-slate-400">All users authenticated with @abes.ac.in domain</p>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search students..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Student</th>
                  <th className="py-3 px-6">Department & Year</th>
                  <th className="py-3 px-6">Roll Number</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Council Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const userId = u.id || u._id;
                  return (
                  <tr key={userId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center space-x-1">
                            <span>{u.name}</span>
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          </div>
                          <span className="text-[11px] text-indigo-600 block">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      <div className="font-semibold">{u.department}</div>
                      <div className="text-[11px] text-slate-400">{u.year}</div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      {u.rollNumber}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {(u.role || 'student').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          onClick={() => toggleUserStatus(userId)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border ${
                            u.status === 'active'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => toggleUserRole(userId)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] border border-slate-200"
                        >
                          Toggle Role
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
