import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API } from '../config'; // ✅ USE CENTRAL CONFIG

// ✅ API endpoints from config
const API_LOGIN_URL = `${API.AUTH}/login`;
const API_LOGOUT_URL = `${API.AUTH}/logout`;

// ✅ Always send cookies (important for session-based auth)
axios.defaults.withCredentials = true;

const AuthContext = createContext({
  user: null,
  login: async () => null,
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }) => {

  // ✅ Load user safely from localStorage
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw || raw === 'undefined') return null;
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

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
      if (data.token) {
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }

      console.log("✅ Login success:", userData);
      return userData;

    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);

      // Clean state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);

      return null;
    }
  };

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
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // ================= SYNC BETWEEN TABS =================
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
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

// ✅ Hook
export const useAuth = () => useContext(AuthContext);