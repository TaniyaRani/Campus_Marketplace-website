import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Edit3, 
  Package, 
  Heart, 
  MessageSquare,
  CheckCircle,
  Calendar,
  X,
  Sparkles,
  ImagePlus,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { uploadApi } from '../services/api';

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { products, wishlist, chats, showToast } = useMarketplace();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    hostel: currentUser?.hostel || '',
    department: currentUser?.department || '',
    year: currentUser?.year || '',
    rollNumber: currentUser?.rollNumber || '',
    avatar: currentUser?.avatar || ''
  });

  React.useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(formData.avatar);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile, formData.avatar]);

  const myListingsCount = products.filter(p => 
    p.seller?.id === currentUser?.id || 
    p.seller?.email?.toLowerCase() === currentUser?.email?.toLowerCase()
  ).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'avatar') setAvatarFile(null);
  };

  const openEditModal = () => {
    setFormData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      hostel: currentUser?.hostel || '',
      department: currentUser?.department || '',
      year: currentUser?.year || '',
      rollNumber: currentUser?.rollNumber || '',
      avatar: currentUser?.avatar || ''
    });
    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Choose a JPG, PNG, WEBP, or GIF image.', 'error');
      e.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be 10 MB or smaller.', 'error');
      e.target.value = '';
      return;
    }

    setAvatarFile(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let avatar = formData.avatar;
      if (avatarFile) {
        const imageData = new FormData();
        imageData.append('image', avatarFile);
        const uploadResult = await uploadApi.uploadSingle(imageData);
        avatar = uploadResult.url;
      }

      const result = await updateProfile({ ...formData, avatar });
      if (!result.success) {
        showToast(result.message || 'Could not update your profile.', 'error');
        return;
      }

      setIsEditing(false);
      setAvatarFile(null);
      showToast('Profile information updated successfully!');
    } catch (error) {
      showToast(error.message || 'Could not upload the profile image.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
        
        {/* Banner Cover */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified ABES Student</span>
            </span>
          </div>
        </div>

        {/* Avatar & Main Bar */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end space-x-4">
              <div className="relative">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                  alt={currentUser?.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-200"
                />
                <span className="absolute bottom-2 right-2 p-1.5 rounded-full bg-emerald-500 text-white ring-2 ring-white" title="Active">
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="pb-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {currentUser?.name || 'ABES Student'}
                </h1>
                <p className="text-xs font-semibold text-indigo-600 flex items-center space-x-1 mt-0.5">
                  <Mail className="w-3 h-3" />
                  <span>{currentUser?.email || 'student@abes.ac.in'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={openEditModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-center">
            <Link to="/my-listings" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 transition-colors">
              <span className="text-xl font-black text-slate-900">{myListingsCount}</span>
              <span className="block text-[11px] font-semibold text-slate-500 mt-0.5">My Listings</span>
            </Link>

            <Link to="/wishlist" className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/50 transition-colors">
              <span className="text-xl font-black text-slate-900">{wishlist.length}</span>
              <span className="block text-[11px] font-semibold text-slate-500 mt-0.5">Saved Items</span>
            </Link>

            <Link to="/chat" className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 transition-colors">
              <span className="text-xl font-black text-slate-900">{chats.length}</span>
              <span className="block text-[11px] font-semibold text-slate-500 mt-0.5">Active Chats</span>
            </Link>

            <div className="p-3 rounded-2xl bg-slate-50">
              <span className="text-xl font-black text-emerald-600">4.9 ★</span>
              <span className="block text-[11px] font-semibold text-slate-500 mt-0.5">Campus Trust Score</span>
            </div>
          </div>
        </div>

      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Academic & Campus Info */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Academic & Identity Records
            </h2>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              College ERP Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-slate-400 font-medium block mb-1">Branch / Department</span>
              <p className="font-bold text-slate-800 text-sm">{currentUser?.department || 'Computer Science & Engineering'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Academic Year</span>
              <p className="font-bold text-slate-800 text-sm">{currentUser?.year || '3rd Year (Junior)'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">College Roll Number</span>
              <p className="font-mono font-bold text-slate-800 text-sm">{currentUser?.rollNumber || '2100320100045'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Mobile Contact</span>
              <p className="font-mono font-bold text-slate-800 text-sm">{currentUser?.phone || '+91 98765 43210'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Campus Residence / Hostel</span>
              <p className="font-bold text-slate-800 text-sm">{currentUser?.hostel || 'Aryabhatta Boys Hostel (BH-2)'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Member Since</span>
              <p className="font-bold text-slate-800 text-sm">{currentUser?.joinedDate || 'August 2021'}</p>
            </div>
          </div>

          {/* College Trust Pledge */}
          <div className="pt-6 border-t border-slate-100 flex items-start space-x-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800">Honor Code Active</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Your profile is verified with your official <code>@abes.ac.in</code> credentials. You are permitted to initiate chats, sell items, and leave ratings on campus transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Links & Safety */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Quick Shortcuts
            </h3>
            <div className="space-y-2">
              <Link
                to="/my-listings"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-indigo-600" />
                  <span>My Active Listings</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{myListingsCount}</span>
              </Link>

              <Link
                to="/wishlist"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Wishlist</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{wishlist.length}</span>
              </Link>

              <Link
                to="/chat"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-xs font-bold text-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>Buyer Messages</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">{chats.length}</span>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Safety Tip
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never share OTPs or college ERP passwords with other students during marketplace exchanges. Inspect equipment inside the college boundary.
            </p>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Update Student Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">College Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus Hostel / Location</label>
                <input
                  type="text"
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Profile Photo</label>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                    alt="Profile photo preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 bg-slate-100"
                  />
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold cursor-pointer hover:bg-slate-50">
                    <ImagePlus className="w-4 h-4" />
                    <span>Choose an image</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleAvatarChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">JPG, PNG, WEBP, or GIF; maximum 10 MB.</p>
                <label htmlFor="avatar-url" className="block font-semibold text-slate-600 mt-3 mb-1">Or use an image URL</label>
                <input
                  type="url"
                  id="avatar-url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold shadow-md shadow-indigo-600/20 inline-flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
