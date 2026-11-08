import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, Loader2, Lock } from 'lucide-react';

/**
 * ProtectedRoute: Guards routes that require valid JWT student or admin authentication.
 * 
 * @param {React.ReactNode} children - The component/view to render if authorized
 * @param {boolean} adminOnly - If true, restricts access to users with role === 'admin'
 * @param {string} redirectTo - Fallback route if unauthenticated (default: '/login')
 */
const ProtectedRoute = ({ children, adminOnly = false, redirectTo = '/login' }) => {
  const { currentUser, token, loading, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. While JWT session is being verified from backend
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-sm">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
          </div>
        </div>
        <h3 className="text-base font-bold text-slate-800">Verifying ABES Student Session</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Checking your JWT token security with the campus auth server...
        </p>
      </div>
    );
  }

  // 2. If user is not authenticated, redirect to login page with return state
  if (!isAuthenticated || !token || !currentUser) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location, message: 'Please log in with your ABES student account to access this page.' }} 
        replace 
      />
    );
  }

  // 3. If adminOnly is requested but user is not an admin
  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-4 border border-rose-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
            Restricted Admin Area
          </span>
          <h2 className="text-xl font-black text-slate-900 mb-2">Campus Council Access Only</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            You are logged in as <strong className="text-slate-700">{currentUser.name}</strong> ({currentUser.email}), which is a student account. This area is reserved exclusively for the ABES Marketplace Council Administrators.
          </p>
          <div className="space-y-2">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Marketplace Home
            </Link>
            <Link
              to="/profile"
              className="w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              View My Student Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized -> Render children
  return children;
};

export default ProtectedRoute;
