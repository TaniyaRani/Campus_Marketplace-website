import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Loader2,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const redirectNotice = location.state?.message;

  // Real-time email validation
  const isAbesEmail = email.trim().toLowerCase().endsWith('@abes.ac.in');
  const showEmailError = emailTouched && email.trim() !== '' && !isAbesEmail;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!email) {
      setErrorMsg('Please enter your ABES student email.');
      return;
    }

    if (!isAbesEmail) {
      setErrorMsg('College policy restriction: Only @abes.ac.in email addresses can log in.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (role = 'student') => {
    if (role === 'admin') {
      setEmail('admin.council@abes.ac.in');
      setPassword('admin123');
    } else {
      setEmail('aryan.21b0101001@abes.ac.in');
      setPassword('student123');
    }
    setEmailTouched(true);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Campus Visual & Perks */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white flex flex-col justify-between hidden md:flex">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <ShoppingBag className="w-5 h-5 text-indigo-300" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">CampusCart</span>
            </div>

            <div className="pt-6">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Students Only</span>
              </span>
              <h2 className="text-2xl font-black mt-3 leading-snug">
                Welcome back to your College Marketplace
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Log in to check buyer queries, negotiate with seniors, or update your listed hostel gear and textbooks.
              </p>
            </div>
          </div>

          {/* Quick Perks List */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Free peer transactions on ABES Campus</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Direct chat without giving phone numbers</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Strict anti-scam college email verification</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400">
            ABES Engineering College • Ghaziabad, UP
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Log In</h1>
            <p className="text-xs text-slate-500 mt-1">
              Use your registered college email address to access your account.
            </p>
          </div>

          {/* Protected Route Redirect Notice */}
          {redirectNotice && !errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-amber-800 text-xs">
              <Info className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">{redirectNotice}</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">{errorMsg}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ABES Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="e.g. aryan.21b0101001@abes.ac.in"
                  className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border bg-slate-50/50 outline-none transition-all placeholder:text-slate-400 text-slate-800 ${
                    showEmailError 
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' 
                      : isAbesEmail 
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  }`}
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {isAbesEmail && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {/* Real-time Email Feedback */}
              {showEmailError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>Must end with <b>@abes.ac.in</b> (College domain)</span>
                </p>
              )}
              {isAbesEmail && (
                <p className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  <span>Valid ABES student domain detected</span>
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact the ABES Marketplace admin or reset via college ERP.'); }} className="text-[11px] text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter your password (min 6 characters)"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-800"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 mt-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In with JWT...</span>
                </>
              ) : (
                <>
                  <span>Log In to CampusCart</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium block mb-2">
              ⚡ Quick Fill for Evaluation:
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="mt-6 text-center text-xs text-slate-500">
            New ABES student?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
