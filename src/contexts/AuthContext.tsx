import React, { createContext, useState, ReactNode } from 'react';
import { AuthContextType } from '../types';

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ role: 'user' | 'admin' } | null>(null);

  const login = (email: string, password: string) => {
    setIsAuthenticated(true);
    setUser({ role: email.includes('admin') ? 'admin' : 'user' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
