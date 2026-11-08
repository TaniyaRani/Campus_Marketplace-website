import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

const ABES_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@abes\.ac\.in$/i;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('abes_campus_token') || null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('abes_campus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Logout helper
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('abes_campus_token');
      localStorage.removeItem('abes_campus_user');
      setToken(null);
      setCurrentUser(null);
      setAuthError('');
    }
  }, []);

  // Listen for unauthorized 401 events dispatched by Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setCurrentUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  // On initial app mount, verify existing JWT token with backend /api/auth/me
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const existingToken = localStorage.getItem('abes_campus_token');
      if (!existingToken) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response?.user) {
          setCurrentUser(response.user);
          localStorage.setItem('abes_campus_user', JSON.stringify(response.user));
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err.message);
        if (isMounted) {
          localStorage.removeItem('abes_campus_token');
          localStorage.removeItem('abes_campus_user');
          setToken(null);
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Email validation rule
  const validateAbesEmail = (email) => {
    if (!email) return { valid: false, message: 'Email address is required.' };
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.endsWith('@abes.ac.in')) {
      return { 
        valid: false, 
        message: 'Access restricted! Only official ABES email (@abes.ac.in) is allowed.' 
      };
    }
    if (!ABES_EMAIL_REGEX.test(trimmed)) {
      return { 
        valid: false, 
        message: 'Invalid ABES email format. Example: name.21b0101001@abes.ac.in' 
      };
    }
    return { valid: true };
  };

  // JWT Login via Axios
  const login = async (email, password) => {
    setAuthError('');
    const validation = validateAbesEmail(email);
    if (!validation.valid) {
      setAuthError(validation.message);
      return { success: false, message: validation.message };
    }

    if (!password || password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    try {
      const res = await authApi.login({
        email: email.trim().toLowerCase(),
        password
      });

      if (res.success && res.token && res.user) {
        localStorage.setItem('abes_campus_token', res.token);
        localStorage.setItem('abes_campus_user', JSON.stringify(res.user));
        setToken(res.token);
        setCurrentUser(res.user);
        setAuthError('');
        return { success: true, user: res.user, token: res.token };
      } else {
        const msg = res.message || 'Login failed. Please verify credentials.';
        setAuthError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Server connection error during login';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // JWT Registration via Axios
  const register = async ({ name, email, password, department, year, hostel, rollNumber, phone }) => {
    setAuthError('');
    const validation = validateAbesEmail(email);
    if (!validation.valid) {
      setAuthError(validation.message);
      return { success: false, message: validation.message };
    }

    if (!name || name.trim().length < 2) {
      const msg = 'Please enter your full name as registered in college records.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (!password || password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setAuthError(msg);
      return { success: false, message: msg };
    }

    try {
      const res = await authApi.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        department,
        year,
        hostel,
        rollNumber: rollNumber || `230032010${Math.floor(1000 + Math.random() * 9000)}`,
        phone: phone || '+91 99999 88888'
      });

      if (res.success && res.token && res.user) {
        localStorage.setItem('abes_campus_token', res.token);
        localStorage.setItem('abes_campus_user', JSON.stringify(res.user));
        setToken(res.token);
        setCurrentUser(res.user);
        setAuthError('');
        return { success: true, user: res.user, token: res.token };
      } else {
        const msg = res.message || 'Registration failed.';
        setAuthError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration error';
      setAuthError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Update profile via Axios
  const updateProfile = async (updates) => {
    try {
      const res = await authApi.updateProfile(updates);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('abes_campus_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Failed to update profile' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      return { success: false, message: msg };
    }
  };

  const isAuthenticated = Boolean(token && currentUser);
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        loading,
        isAuthenticated,
        isAdmin,
        authError,
        login,
        register,
        logout,
        updateProfile,
        validateAbesEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
