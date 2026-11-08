import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  IndianRupee,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

const SAMPLE_PRESETS = [
  { label: 'Scientific Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Engineering Drafter', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Mountain Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Hostel Cooler', url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80' },
  { label: 'Textbook / Notes', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Electric Kettle', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80' }
];

const AddProduct = () => {
  const { id } = useParams(); // If editing
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, showToast, uploadFiles } = useMarketplace();
  const { currentUser } = useAuth();

  const isEditMode = Boolean(id);
  const existingProduct = isEditMode ? products.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    category: 'books',
    price: '',
    originalPrice: '',
    condition: 'Good',
    location: 'Central Canteen, ABES Campus',
    description: '',
    imageUrl: ''
  });

  const [imagesList, setImagesList] = useState([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditMode && existingProduct) {
      setFormData({
        title: existingProduct.title,
        category: existingProduct.category,
        price: existingProduct.price.toString(),
        originalPrice: existingProduct.originalPrice ? existingProduct.originalPrice.toString() : '',
        condition: existingProduct.condition,
        location: existingProduct.location,
        description: existingProduct.description,
        imageUrl: ''
      });
      setImagesList(existingProduct.images || []);
    }
  }, [isEditMode, existingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleAddImage = (urlToAdd) => {
    const targetUrl = urlToAdd || formData.imageUrl.trim();
    if (!targetUrl) return;

    if (imagesList.length >= 4) {
      setError('You can add up to 4 images per listing.');
      return;
    }

    setImagesList(prev => [...prev, targetUrl]);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleRemoveImage = (index) => {
    setImagesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (!selected.length) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFile = selected.find((file) => !allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024);
    if (invalidFile) {
      setError(`${invalidFile.name} must be a JPG, PNG, WEBP, or GIF image under 10MB.`);
      return;
    }

    const room = 4 - imagesList.length;
    if (room <= 0) {
      setError('You can add up to 4 images per listing.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const urls = await uploadFiles(selected.slice(0, room));
      if (!urls.length) {
        setError('Image upload failed. Try another file.');
        return;
      }
      setImagesList(prev => [...prev, ...urls].slice(0, 4));
      showToast(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (err) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      showToast('Please log in first to create or edit listings', 'info');
      navigate('/login');
      return;
    }

    if (!formData.title.trim()) {
      setError('Product title is required.');
      return;
    }

    const priceNum = Number(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please specify a valid price greater than 0.');
      return;
    }

    const finalImages = imagesList.length > 0 
      ? imagesList 
      : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'];

    const productPayload = {
      title: formData.title.trim(),
      category: formData.category,
      price: priceNum,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      condition: formData.condition,
      location: formData.location.trim() || 'ABES Engineering College',
      description: formData.description.trim() || 'Good working condition, available for immediate handover on campus.',
      images: finalImages,
      isFeatured: false
    };

    try {
      if (isEditMode) {
        await updateProduct(id, productPayload);
      } else {
        await addProduct(productPayload);
      }
      navigate('/my-listings');
    } catch (err) {
      setError(err.message || 'The listing could not be saved.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/my-listings"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Listings</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Campus Peer Listing Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {isEditMode ? 'Edit Product Listing' : 'Post an Item for Sale'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Pass on your semesters items to juniors or fellow batchmates inside ABES.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Listing Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Casio FX-991EX Calculator / 21-Speed Cycle / CLRS Book"
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800 font-medium"
              required
            />
          </div>

          {/* Category & Condition Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Item Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800"
              >
                <option value="Brand New">Brand New (Unopened / Tagged)</option>
                <option value="Like New">Like New (Used few times, no scratches)</option>
                <option value="Good">Good (Working nicely, light signs of use)</option>
                <option value="Fair">Fair (Functional, visible cosmetic wear)</option>
              </select>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Your Selling Price (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 850"
                  min="1"
                  className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800 font-bold"
                  required
                />
                <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">₹</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Original Retail / MRP Price (₹) <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="e.g. 1595"
                  min="1"
                  className="w-full pl-8 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800"
                />
                <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold">₹</span>
              </div>
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Campus Handover Location / Spot
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Aryabhatta BH-2 Gate, Central Canteen, or Block B Labs"
                className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Description & Details
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell buyers about accessories included, which semester you used it, reasons for selling, battery life, etc."
              className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800 leading-relaxed"
            />
          </div>

          {/* Image Upload / Preview Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">
                Item Images (Live Preview)
              </label>
              <span className="text-[11px] text-slate-400">{imagesList.length} / 4 added</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || imagesList.length >= 4}
              className="w-full py-6 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
            >
              <Upload className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">
                {uploading ? 'Uploading photos...' : 'Upload photos from your device'}
              </span>
              <span className="text-[11px] text-indigo-400 mt-0.5">JPG, PNG, or WEBP · up to 4 images · 10MB each</span>
            </button>

            {/* URL input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste direct image URL (or pick a preset below)..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800"
                />
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="button"
                onClick={() => handleAddImage()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add Image
              </button>
            </div>

            {/* Presets Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-semibold">Or sample images:</span>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleAddImage(preset.url)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors"
                >
                  + {preset.label}
                </button>
              ))}
            </div>

            {/* Images Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              {imagesList.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
                  <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-slate-900/75 text-white text-[9px] font-bold">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {imagesList.length === 0 && (
                <div className="col-span-full py-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <Upload className="w-8 h-8 mb-2 text-slate-300" />
                  <span className="text-xs font-medium">No images uploaded yet.</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">Upload a photo, pick a sample, or paste an image URL</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              to="/my-listings"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5"
            >
              {isEditMode ? 'Save Changes' : 'Publish to Campus'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddProduct;
