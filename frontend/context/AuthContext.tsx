import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await userService.me();
      if (response?.data?.success) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = () => {
      refreshUser();
    }

    init();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
      Cookies.remove('frontend-token');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      // Optional: redirect to sign-in
      window.location.href = '/sign-in';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
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
