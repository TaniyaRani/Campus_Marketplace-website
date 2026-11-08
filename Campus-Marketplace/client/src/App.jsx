import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import MyListings from './pages/MyListings';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Global Toast Banner
const GlobalToast = () => {
  const { toast } = useMarketplace();
  if (!toast) return null;

  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border ${
        isInfo 
          ? 'bg-slate-900 text-white border-slate-700' 
          : 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20'
      }`}>
        {isInfo ? (
          <Info className="w-4 h-4 text-slate-300 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Protected Routes (Requires JWT Authentication) */}
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route (Requires Admin Role & JWT) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <GlobalToast />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MarketplaceProvider>
          <AppContent />
        </MarketplaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
