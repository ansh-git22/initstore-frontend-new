import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import { API } from '../config'; // ✅ USE CENTRAL CONFIG

// ✅ API endpoints from config
const API_LOGIN_URL = `${API.AUTH}/login`;
const API_LOGOUT_URL = `${API.AUTH}/logout`;

// ✅ Always send cookies (important for session-based auth)
=======

// FIXED: Changed from /signin to /login to match your backend
const API_LOGIN_URL = 'https://initstore-backend-4.onrender.com/api/auth/login';
const API_LOGOUT_URL = 'https://initstore-backend-4.onrender.com/api/auth/logout';

// CRITICAL: Configure axios to send cookies with every request
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
axios.defaults.withCredentials = true;

const AuthContext = createContext({
  user: null,
<<<<<<< HEAD
  login: async () => null,
  logout: async () => {},
=======
  login: () => {},
  logout: () => {},
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {
<<<<<<< HEAD

  // ✅ Load user safely from localStorage
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw || raw === 'undefined') return null;
      return JSON.parse(raw);
    } catch {
=======
  // Initialize user from localStorage (safe parsing)
  const [user, setUser] = useState(() => {
    try {
      if (typeof window === 'undefined') return null;
      const raw = localStorage.getItem('user');
      if (!raw || raw === 'undefined') return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading user from localStorage', err);
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
      localStorage.removeItem('user');
      return null;
    }
  });

<<<<<<< HEAD
  // ================= LOGIN =================
  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(
        API_LOGIN_URL,
        { email, password },
        { withCredentials: true }
      );

      const data = response.data;
      const userData = data.user;

      if (!userData) throw new Error("Invalid login response");

      // ✅ Save user
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // ✅ Handle JWT token (if backend sends it)
=======
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
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

<<<<<<< HEAD
      console.log("✅ Login success:", userData);
      return userData;

    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);

      // Clean state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);

=======
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
      
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
      return null;
    }
  };

<<<<<<< HEAD
  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await axios.post(API_LOGOUT_URL, {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout request failed, clearing anyway");
    }

    // ✅ Always clear frontend state
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);

    console.log("👋 Logged out");
  };

  // ================= RESTORE TOKEN =================
=======
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
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

<<<<<<< HEAD
  // ================= SYNC BETWEEN TABS =================
=======
  // Keep state in sync if another tab changes localStorage
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'user') {
        try {
<<<<<<< HEAD
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
=======
          setUser(e.newValue && e.newValue !== 'undefined' ? JSON.parse(e.newValue) : null);
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
        } catch {
          setUser(null);
        }
      }
    };
<<<<<<< HEAD

=======
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
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

<<<<<<< HEAD
// ✅ Hook
export const useAuth = () => useContext(AuthContext);
=======
export const useAuth = () => useContext(AuthContext);
>>>>>>> 71d71638d88c4750ebf6ca5eb41dda7a60b1c763
