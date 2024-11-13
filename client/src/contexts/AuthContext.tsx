import React, { createContext, useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { EVENTS } from '../constants/events';
import { getAuthConfig, verifyToken } from '../utils/api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthRequired: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const handleAuthError = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      addToast('Session expired. Please login again.', 'warning');
    };

    window.addEventListener(EVENTS.AUTH_ERROR, handleAuthError);
    return () => window.removeEventListener(EVENTS.AUTH_ERROR, handleAuthError);
  }, [addToast]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const config = await getAuthConfig();
        setIsAuthRequired(config.authRequired);

        const token = localStorage.getItem('token');
        if (token && config.authRequired) {
          const isValid = await verifyToken();
          setIsAuthenticated(isValid);
          if (!isValid) {
            localStorage.removeItem('token');
            addToast('Session expired. Please login again.', 'warning');
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthRequired(false);
        setIsAuthenticated(false);
        addToast('Failed to initialize authentication.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [addToast]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    addToast('Successfully logged out.', 'info');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthRequired, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};