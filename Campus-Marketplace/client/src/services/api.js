import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request Interceptor: Attach JWT Bearer token to every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('abes_campus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle responses and 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid or expired credentials
      localStorage.removeItem('abes_campus_token');
      localStorage.removeItem('abes_campus_user');

      // Dispatch event for reactive auth listeners
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized', {
          detail: { message: error.response?.data?.message || 'Session expired. Please log in again.' }
        }));
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to extract response data or reject with formatted error
const extractData = (promise) =>
  promise
    .then((res) => res.data)
    .catch((err) => {
      const msg = err.response?.data?.message || err.message || 'Network request failed';
      const error = new Error(msg);
      error.status = err.response?.status;
      error.data = err.response?.data;
      throw error;
    });

// ==========================================
// 1. Auth APIs
// ==========================================
export const authApi = {
  // Login with ABES email and password
  login: (credentials) => extractData(apiClient.post('/auth/login', credentials)),

  // Register new student account
  register: (userData) => extractData(apiClient.post('/auth/register', userData)),

  // Logout current session
  logout: () => extractData(apiClient.post('/auth/logout')),

  // Get current authenticated user profile
  getMe: () => extractData(apiClient.get('/auth/me')),

  // Update current user profile
  updateProfile: (profileData) => extractData(apiClient.put('/auth/profile', profileData))
};

// ==========================================
// 2. Product APIs
// ==========================================
export const productApi = {
  // View / List Products with filters
  getAll: (params = {}) => extractData(apiClient.get('/products', { params })),

  // View Single Product by ID
  getById: (id) => extractData(apiClient.get(`/products/${id}`)),

  // Search Products
  search: (query) => extractData(apiClient.get('/products/search', { params: { q: query } })),

  // Add Product (Requires JWT)
  create: (productData) => extractData(apiClient.post('/products', productData)),

  // Update Product (Requires JWT)
  update: (id, updateData) => extractData(apiClient.put(`/products/${id}`, updateData)),

  // Delete Product (Requires JWT)
  delete: (id) => extractData(apiClient.delete(`/products/${id}`)),

  // Get My Listings (Requires JWT)
  getMyListings: () => extractData(apiClient.get('/products/my/listings'))
};

// ==========================================
// 3. Wishlist APIs
// ==========================================
export const wishlistApi = {
  // Get all wishlisted items (Requires JWT)
  getWishlist: () => extractData(apiClient.get('/wishlist')),

  // Toggle favorite product (add/remove) (Requires JWT)
  toggle: (productId) => extractData(apiClient.post(`/wishlist/toggle/${productId}`)),

  // Add product to wishlist (Requires JWT)
  add: (productId) => extractData(apiClient.post(`/wishlist/${productId}`)),

  // Remove product from wishlist (Requires JWT)
  remove: (productId) => extractData(apiClient.delete(`/wishlist/${productId}`))
};

// ==========================================
// 4. Chat APIs
// ==========================================
export const chatApi = {
  // Get all conversation threads for logged-in user (Requires JWT)
  getChats: () => extractData(apiClient.get('/chats')),

  // Get specific chat history (Requires JWT)
  getChatById: (chatId) => extractData(apiClient.get(`/chats/${chatId}`)),

  // Start new or retrieve existing chat between buyer & seller (Requires JWT)
  startChat: (chatPayload) => extractData(apiClient.post('/chats/start', chatPayload)),

  // Save new message in chat (Requires JWT)
  sendMessage: (chatId, text) =>
    extractData(apiClient.post(`/chats/${chatId}/messages`, { text })),
  // Mark messages addressed to the current user as read
  markAsRead: (chatId) => extractData(apiClient.put(`/chats/${chatId}/read`))
};

// ==========================================
// 5. Admin APIs
// ==========================================
export const adminApi = {
  // Dashboard stats (Requires JWT & Admin Role)
  getStats: () => extractData(apiClient.get('/admin/stats')),

  // Users management (Requires JWT & Admin Role)
  getUsers: (params = {}) => extractData(apiClient.get('/admin/users', { params })),

  // Update user active / suspended status
  updateUserStatus: (userId, status) =>
    extractData(apiClient.put(`/admin/users/${userId}/status`, { status })),

  // Update user role (admin / student)
  updateUserRole: (userId, role) =>
    extractData(apiClient.put(`/admin/users/${userId}/role`, { role })),

  // Delete user account
  deleteUser: (userId) => extractData(apiClient.delete(`/admin/users/${userId}`)),

  // Product listings management
  getProducts: (params = {}) => extractData(apiClient.get('/admin/products', { params })),

  // Update product active / sold / suspended status
  updateProductStatus: (productId, status) =>
    extractData(apiClient.put(`/admin/products/${productId}/status`, { status })),

  // Delete product listing
  deleteProduct: (productId) => extractData(apiClient.delete(`/admin/products/${productId}`))
};

// ==========================================
// 6. Upload APIs
// ==========================================
export const uploadApi = {
  // Upload a single image file
  uploadSingle: (formData) =>
    extractData(
      apiClient.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    ),

  // Upload multiple image files (up to 6)
  uploadMultiple: (formData) =>
    extractData(
      apiClient.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    )
};

export { apiClient };
export default {
  auth: authApi,
  product: productApi,
  wishlist: wishlistApi,
  chat: chatApi,
  admin: adminApi,
  upload: uploadApi,
  client: apiClient
};
