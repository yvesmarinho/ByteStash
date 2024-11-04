import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthConfig, verifyToken, AUTH_ERROR_EVENT } from '../api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthRequired: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthError = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    };

    window.addEventListener(AUTH_ERROR_EVENT, handleAuthError);

    return () => {
      window.removeEventListener(AUTH_ERROR_EVENT, handleAuthError);
    };
  }, []);

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
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthRequired(false);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAuthRequired, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};