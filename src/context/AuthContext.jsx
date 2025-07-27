import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On app mount, check auth by calling backend /auth/check
  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get('/auth/check'); // will succeed if JWT cookie valid
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Login sets authenticated true, logout calls backend to clear cookie and sets false
  const login = () => setAuthenticated(true);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setAuthenticated(false);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
