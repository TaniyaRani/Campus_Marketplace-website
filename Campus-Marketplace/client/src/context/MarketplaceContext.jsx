import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { productApi, wishlistApi, chatApi, adminApi, uploadApi } from '../services/api';
import { useAuth } from './AuthContext';

const MarketplaceContext = createContext();

// Helper to normalize product objects so id and seller are consistently accessible
const mapApiChat = (c, currentUser) => {
  const myId = String(currentUser?.id || currentUser?._id || '');
  const senderId = (sender) => String(sender?._id || sender?.id || sender || '');
  const peer = c.participant || {};

  return {
    id: String(c.chatId || c.id || c._id),
    productId: String(c.productId || c.product?._id || c.product?.id || c.product || ''),
    productTitle: c.productTitle || c.product?.title || 'Product Listing',
    productPrice: c.productPrice ?? c.product?.price ?? 0,
    productImage: c.productImage || c.product?.images?.[0] || '',
    participant: {
      id: String(peer.id || peer._id || 'peer'),
      name: peer.name || 'ABES Student',
      email: peer.email || 'peer@abes.ac.in',
      avatar: peer.avatar,
      department: peer.department || 'Engineering'
    },
    messages: (c.messages || []).map((m) => {
      const fromMe = m.sender === 'me' || m.isSelf || senderId(m.sender) === myId;
      return {
        id: m.id || m._id,
        sender: fromMe ? 'me' : 'seller',
        text: m.text,
        time: m.time || (m.createdAt
          ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'Now'),
        isSelf: fromMe
      };
    }),
    unread: c.unread || 0,
    lastMessage: c.lastMessage || ''
  };
};

const normalizeProduct = (p) => {
  const prodId = String(p.id || p._id);
  const sellerObj = p.sellerInfo || (typeof p.seller === 'object' ? p.seller : null) || {
    id: String(p.seller || 'unknown'),
    name: 'ABES Student',
    email: 'student@abes.ac.in',
    department: 'Engineering',
    year: 'Student'
  };

  return {
    ...p,
    id: prodId,
    _id: prodId,
    seller: sellerObj,
    sellerInfo: sellerObj
  };
};

export const MarketplaceProvider = ({ children }) => {
  const { token, currentUser, isAuthenticated, isAdmin } = useAuth();

  // Products state (defaults to INITIAL_PRODUCTS, loaded from backend)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('abes_campus_products');
      if (saved) {
        const cachedProducts = JSON.parse(saved);
        return isAdmin
          ? cachedProducts
          : cachedProducts.filter((product) => !product.status || product.status === 'active');
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  // Wishlist state (list of product IDs)
  const [wishlist, setWishlist] = useState([]);

  // Chats state
  const [chats, setChats] = useState([]);

  // Users state (for Admin Console)
  const [usersList, setUsersList] = useState([]);
  const [adminStats, setAdminStats] = useState(null);

  // Global search & notification toast
  const [globalSearch, setGlobalSearch] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  // Save state backups to localStorage
  useEffect(() => {
    localStorage.setItem('abes_campus_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('abes_campus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('abes_campus_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('abes_campus_users_list', JSON.stringify(usersList));
  }, [usersList]);

  // 1. Fetch live products from Backend via Axios
  const loadProducts = useCallback(async () => {
    try {
      const res = isAdmin
        ? await adminApi.getProducts({ status: 'all' })
        : await productApi.getAll({ limit: 50, status: 'active' });
      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        const normalized = res.data.map(normalizeProduct);
        setProducts(normalized);
      } else if (res?.success && Array.isArray(res.data)) {
        setProducts([]);
      }
    } catch (err) {
      console.error('Unable to load marketplace listings:', err.message);
      if (!isAdmin) {
        setProducts((current) => current.filter((product) => !product.status || product.status === 'active'));
      }
    }
  }, [isAdmin]);

  const loadChats = useCallback(async () => {
    if (!token || !currentUser) {
      setChats([]);
      return;
    }
    try {
      const res = await chatApi.getChats();
      if (res?.success && Array.isArray(res.data)) {
        setChats(res.data.map((chat) => mapApiChat(chat, currentUser)));
      }
    } catch (err) {
      console.error('Unable to load conversations:', err.message);
    }
  }, [token, currentUser]);

  // 2. Fetch authenticated user data (Wishlist & Chats) via Axios
  const loadUserData = useCallback(async () => {
    if (!token || !currentUser) {
      setWishlist([]);
      setChats([]);
      setUsersList([]);
      setAdminStats(null);
      return;
    }

    // Load Wishlist
    try {
      const res = await wishlistApi.getWishlist();
      if (res?.success) {
        const ids = Array.isArray(res.productIds)
          ? res.productIds
          : (res.data || []).map((item) => {
              if (typeof item === 'string') return item;
              return item._id || item.id || item.productId || item.product?._id || item.product?.id;
            });
        setWishlist(ids.filter(Boolean).map(String));
      }
    } catch (err) {
      setWishlist([]);
      console.error('Unable to load wishlist:', err.message);
    }

    // Load Chats
    await loadChats();

    // If Admin, load users list
    if (isAdmin) {
      try {
        const [usersRes, statsRes] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getStats()
        ]);
        if (usersRes?.success && Array.isArray(usersRes.data)) setUsersList(usersRes.data);
        if (statsRes?.success) setAdminStats(statsRes.stats);
      } catch (err) {
        setUsersList([]);
        setAdminStats(null);
        console.error('Unable to load admin dashboard data:', err.message);
      }
    } else {
      setUsersList([]);
      setAdminStats(null);
    }
  }, [token, currentUser, isAdmin, loadChats]);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load user data whenever token changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // ==========================================
  // Product Actions (Integrated with Axios)
  // ==========================================
  const addProduct = async (productData) => {
    try {
      const res = await productApi.create(productData);
      if (res?.success && res.data) {
        const newProduct = normalizeProduct(res.data);
        setProducts(prev => [newProduct, ...prev]);
        showToast('Listing published successfully to campus marketplace!');
        return newProduct;
      }
      throw new Error(res?.message || 'The listing could not be published.');
    } catch (err) {
      showToast(err.message, 'info');
      throw err;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await productApi.update(id, updatedFields);
      if (!res?.success) throw new Error(res?.message || 'The listing could not be updated.');
      setProducts(prev => prev.map(p => (p.id === id || p._id === id ? { ...p, ...updatedFields } : p)));
    } catch (err) {
      showToast(err.message, 'info');
      throw err;
    }

    showToast('Listing updated successfully!');
  };

  const deleteProduct = async (id) => {
    try {
      await productApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
      setWishlist(prev => prev.filter(item => item !== id));
    } catch (err) {
      showToast(err.message, 'info');
      throw err;
    }

    showToast('Product listing deleted.', 'info');
  };

  // ==========================================
  // Wishlist Actions (Integrated with Axios)
  // ==========================================
  const toggleWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await wishlistApi.toggle(productId);
        if (!res?.success) throw new Error(res?.message || 'Wishlist could not be updated.');
        const isWishlistedNow = Boolean(res.isWishlisted);
        setWishlist(prev => isWishlistedNow
          ? Array.from(new Set([...prev, String(productId)]))
          : prev.filter(id => id !== String(productId))
        );
        showToast(res.message || (isWishlistedNow ? 'Added to your wishlist!' : 'Removed from wishlist'), isWishlistedNow ? 'success' : 'info');
      } catch (err) {
        showToast(err.message, 'info');
      }
      return;
    }

    setWishlist(prev => prev.includes(String(productId))
      ? prev.filter(id => id !== String(productId))
      : [...prev, String(productId)]
    );
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await wishlistApi.remove(productId);
        setWishlist(prev => prev.filter(id => id !== String(productId)));
        showToast('Item removed from your wishlist', 'info');
      } catch (err) {
        showToast(err.message, 'info');
      }
      return;
    }
    setWishlist(prev => prev.filter(id => id !== String(productId)));
    showToast('Item removed from your wishlist', 'info');
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // ==========================================
  // Chat Actions (Integrated with Axios & Real-time Features)
  // ==========================================
  const markChatAsRead = useCallback(async (chatId) => {
    if (isAuthenticated) {
      try {
        await chatApi.markAsRead(chatId);
      } catch (err) {
        showToast(err.message, 'info');
        return;
      }
    }
    setChats(prev => prev.map(c => (c.id === chatId ? { ...c, unread: 0 } : c)));
  }, [isAuthenticated, showToast]);

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    showToast('Conversation deleted', 'info');
  };

  const sendMessage = async (chatId, text, options = {}) => {
    const { image = null, offer = null } = options;
    if ((!text || !text.trim()) && !image && !offer) return;

    const messageText = text ? text.trim() : (offer ? `Proposed Offer: ₹${offer}` : 'Sent an image');

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text: messageText,
      image: image || null,
      offer: offer || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    if (isAuthenticated) {
      try {
        const res = await chatApi.sendMessage(chatId, messageText);
        if (!res?.success) throw new Error(res?.message || 'Message could not be sent.');
        await loadChats();
      } catch (err) {
        showToast(err.message, 'info');
      }
      return;
    }

    setChats(prev => prev.map(chat => chat.id === chatId
      ? { ...chat, messages: [...(chat.messages || []), newMessage], lastMessage: messageText }
      : chat
    ));
  };

  const startChatWithSeller = async (product, seller) => {
    const productId = String(product.id || product._id);
    const existing = chats.find(c => String(c.productId) === productId);
    if (existing) {
      return existing.id;
    }

    const initialText = `Hi ${seller.name}, I'm interested in your "${product.title}" listed for ₹${product.price}. Is it available?`;

    if (isAuthenticated) {
      try {
        const res = await chatApi.startChat({
          productId: product.id || product._id,
          sellerId: seller.id || seller._id,
          productTitle: product.title,
          productPrice: product.price,
          productImage: product.images?.[0] || '',
          sellerName: seller.name,
          sellerEmail: seller.email,
          initialMessage: initialText
        });

        if (res?.success && res.data) {
          const apiChat = mapApiChat(res.data, currentUser);
          if (!apiChat.participant?.name || apiChat.participant.name === 'ABES Student') {
            apiChat.participant = {
              id: seller.id || seller._id,
              name: seller.name,
              email: seller.email,
              avatar: seller.avatar,
              department: seller.department
            };
          }
          setChats(prev => [apiChat, ...prev.filter(c => c.id !== apiChat.id)]);
          return apiChat.id;
        }
        throw new Error(res?.message || 'Could not start this conversation.');
      } catch (err) {
        showToast(err.message, 'info');
        throw err;
      }
    }

    // Local fallback
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      id: newChatId,
      participant: {
        id: seller.id || `seller-${Date.now()}`,
        name: seller.name || 'ABES Student',
        email: seller.email || 'seller@abes.ac.in',
        avatar: seller.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        department: `${seller.department || 'Engineering'} (${seller.year || 'Student'})`
      },
      productId: product.id || product._id,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          sender: 'me',
          text: initialText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: true
        }
      ],
      unread: 0
    };

    setChats(prev => [newChat, ...prev]);
    return newChatId;
  };

  // ==========================================
  // Admin Actions (Integrated with Axios)
  // ==========================================
  const toggleUserStatus = async (userId) => {
    const user = usersList.find(u => (u.id || u._id) === userId);
    if (!isAdmin || !user) return;
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await adminApi.updateUserStatus(userId, newStatus);
      setUsersList(prev => prev.map(u => (u.id || u._id) === userId ? { ...u, status: newStatus } : u));
      showToast(`Student ${user.name} status set to ${newStatus}`, 'info');
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  const toggleUserRole = async (userId) => {
    const user = usersList.find(u => (u.id || u._id) === userId);
    if (!isAdmin || !user) return;
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => (u.id || u._id) === userId ? { ...u, role: newRole } : u));
      showToast(`Updated ${user.name} role to ${newRole}`);
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  const adminSetProductStatus = async (productId, status) => {
    if (!isAdmin) return;
    try {
      await adminApi.updateProductStatus(productId, status);
      setProducts(prev => prev.map(p => (p.id === productId || p._id === productId) ? { ...p, status } : p));
      showToast(`Product status updated to ${status}`);
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  const adminDeleteProduct = async (productId) => {
    if (!isAdmin) return;
    try {
      await adminApi.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId && p._id !== productId));
      setWishlist(prev => prev.filter(id => id !== String(productId)));
      showToast('Listing permanently removed by Admin', 'info');
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  const adminDeleteUser = async (userId) => {
    if (!isAdmin) return;
    try {
      await adminApi.deleteUser(userId);
      setUsersList(prev => prev.filter(u => u.id !== userId && u._id !== userId));
      showToast('User account removed', 'info');
    } catch (err) {
      showToast(err.message, 'info');
    }
  };

  // ==========================================
  // Store image uploads through the authenticated backend endpoint.
  // ==========================================
  const uploadFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return [];
    const filesArray = Array.from(fileList);

    try {
      const formData = new FormData();
      filesArray.forEach((f) => formData.append('images', f));
      const res = await uploadApi.uploadMultiple(formData);
      if (res?.success && Array.isArray(res.urls) && res.urls.length > 0) {
        return res.urls;
      }
      throw new Error(res?.message || 'The selected images could not be uploaded.');
    } catch (backendErr) {
      showToast(backendErr.message, 'info');
      throw backendErr;
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        wishlist,
        chats,
        usersList,
        adminStats,
        globalSearch,
        setGlobalSearch,
        toast,
        showToast,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
        sendMessage,
        startChatWithSeller,
        deleteChat,
        markChatAsRead,
        toggleUserStatus,
        toggleUserRole,
        adminSetProductStatus,
        adminDeleteProduct,
        adminDeleteUser,
        uploadFiles,
        loadProducts,
        loadUserData,
        loadChats
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => useContext(MarketplaceContext);
export default MarketplaceContext;
