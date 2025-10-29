import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// FIXED: Changed from /signin to /login to match your backend
const API_LOGIN_URL = 'https://initstore-backend-4.onrender.com/api/auth/login';
const API_LOGOUT_URL = 'https://initstore-backend-4.onrender.com/api/auth/logout';

// CRITICAL: Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage (safe parsing)
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('user');
      if (!raw || raw === 'undefined') return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading user from localStorage', err);
      localStorage.removeItem('user');
      return null;
    }
  });

  /**
   * Login function: Makes API call and updates global state
   * @param {Object} credentials - { email, password }
   * @returns {Object|null} - User data object if successful, null if failed
   */
  const login = async ({ email, password }) => {
    try {
      // CRITICAL: withCredentials allows cookies/session to be sent
      const response = await axios.post(
        API_LOGIN_URL, 
        { email, password },
        { withCredentials: true }
      );
      
      const data = response.data;
      const userData = data.user;

      if (!userData) {
        throw new Error('Invalid response from server');
      }

      // ✅ Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // ✅ If backend returns a token, store it & attach to axios
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      console.log('Login successful:', { 
        name: userData.name, 
        email: userData.email, 
        isAdmin: userData.isAdmin 
      });

      return userData;
    } catch (error) {
      console.error('Authentication failed:', error.response?.data?.error || error.message);
      
      // Clear any partial state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      
      return null;
    }
  };

  const logout = async () => {
    try {
      await axios.post(API_LOGOUT_URL, {}, { withCredentials: true });

      // ✅ Clear local storage & axios header
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);

      console.log('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  // ✅ Restore token on page reload
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Keep state in sync if another tab changes localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'user') {
        try {
          setUser(e.newValue && e.newValue !== 'undefined' ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
