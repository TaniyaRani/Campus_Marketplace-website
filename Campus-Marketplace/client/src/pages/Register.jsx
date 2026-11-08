import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Phone,
  Building2,
  GraduationCap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'CSE (Artificial Intelligence & ML)',
  'CSE (Data Science)',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EN)',
  'Mechanical Engineering (ME)',
  'Master of Computer Applications (MCA)',
  'Master of Business Admin (MBA)'
];

const YEARS = [
  { value: '1st Year', label: '1st Year (Freshman)' },
  { value: '2nd Year', label: '2nd Year (Sophomore)' },
  { value: '3rd Year', label: '3rd Year (Junior)' },
  { value: '4th Year', label: '4th Year (Senior)' }
];

const HOSTELS = [
  'Aryabhatta Boys Hostel (BH-1)',
  'Aryabhatta Boys Hostel (BH-2)',
  'Ramanujan Hostel (BH-3)',
  'Kalpana Chawla Girls Hostel (GH-1)',
  'Sarojini Girls Hostel (GH-2)',
  'Day Scholar (Ghaziabad / Noida / Delhi)'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    hostel: 'Aryabhatta Boys Hostel (BH-1)',
    rollNumber: '',
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const isAbesEmail = formData.email.trim().toLowerCase().endsWith('@abes.ac.in');
  const showEmailError = emailTouched && formData.email.trim() !== '' && !isAbesEmail;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!isAbesEmail) {
      setErrorMsg('College policy restriction: Registration is strictly limited to official @abes.ac.in email addresses.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/products');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-5">
        
        {/* Left Side: Branded Sidebar */}
        <div className="md:col-span-2 relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white flex flex-col justify-between hidden md:flex">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <ShoppingBag className="w-5 h-5 text-indigo-300" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">CampusCart</span>
            </div>

            <div className="pt-4">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Outside Scams</span>
              </span>
              <h2 className="text-2xl font-black mt-3 leading-snug">
                Join the verified ABES student collective
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Every listing is placed and purchased by a registered ABES student. Buy cheap, sell when the semester ends, and save money.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-slate-300">
            <p className="font-semibold text-white">Quick Rules:</p>
            <p>1. Must use active <code className="text-amber-300">@abes.ac.in</code> email.</p>
            <p>2. No prohibited or hazardous items.</p>
            <p>3. In-person inspection before payment.</p>
          </div>

          <div className="text-[11px] text-slate-400">
            Student Welfare Initiative • ABES EC
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Student Account</h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify your official college identity to buy and sell on campus.
            </p>
          </div>

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
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (As per College ID)</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Aryan Sharma"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-800"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* ABES Email Field with Live Domain Verification */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official ABES College Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="e.g. student.22b010100@abes.ac.in"
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

              {showEmailError && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>Only official <b>@abes.ac.in</b> emails are authorized!</span>
                </p>
              )}
              {isAbesEmail && (
                <p className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                  <span>Valid ABES student domain detected</span>
                </p>
              )}
            </div>

            {/* Branch and Year row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch / Department</label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-3 pr-8 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 text-slate-800"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full pl-3 pr-8 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 text-slate-800"
                >
                  {YEARS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hostel / Residence */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Campus Residence / Hostel</label>
              <select
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                className="w-full pl-3 pr-8 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 text-slate-800"
              >
                {HOSTELS.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Passwords row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 text-slate-800"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-indigo-500 text-slate-800"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Student Account...</span>
                </>
              ) : (
                <>
                  <span>Complete ABES Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:underline">
              Log in here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
