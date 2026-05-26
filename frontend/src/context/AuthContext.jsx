import React, { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronous — runs before React paints anything
  const [user, setUser] = useState(() => {
    try {
      return authService.getCurrentUser();
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const guestLogin = async () => {
    const data = await authService.guestLogin();
    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      guestLogin,
      logout,
      isAuthenticated: !!user,
      isGuest:         Boolean(user?.isGuest),
      loading:         false,   // always false — synchronous init
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
