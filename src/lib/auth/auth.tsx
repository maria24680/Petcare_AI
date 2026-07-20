'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { authClient, googleProvider } from './auth-client';

// Import types directly from user file
import type { User, RegisterData, VendorRegisterData } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  registerWithGoogle: () => Promise<void>;
  registerVendor: (data: VendorRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Email/Password Login
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      const { data } = response.data;

      localStorage.setItem('token', 'temp-token');
      localStorage.setItem('user', JSON.stringify(data));

      setUser(data);

      // Redirect based on role
      if (data.role === 'admin') {
        router.push('/dashboard/admin/dashboard');
      } else if (data.role === 'vendor') {
        router.push('/dashboard/vendor/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // ✅ Google Login
  const loginWithGoogle = async () => {
    try {
      await googleProvider.signIn();
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error('Google login failed. Please try again.');
    }
  };

  // ✅ Email/Password Registration
  const register = async (data: RegisterData) => {
    try {
      const response = await apiClient.post('/users/register', data);
      const { data: userData } = response.data;

      localStorage.setItem('token', 'temp-token');
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // ✅ Google Registration
  const registerWithGoogle = async () => {
    try {
      await googleProvider.signIn();
    } catch (error: any) {
      console.error('Google registration error:', error);
      throw new Error('Google registration failed. Please try again.');
    }
  };

  // ✅ Vendor Registration
  const registerVendor = async (data: VendorRegisterData) => {
    try {
      const response = await apiClient.post('/vendors/register', data);
      const { data: userData } = response.data;

      localStorage.setItem('token', 'temp-token');
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      router.push('/dashboard/vendor/dashboard');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Vendor registration failed');
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await authClient.signOut();
    } catch {
      // Continue even if signOut fails
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    registerWithGoogle,
    registerVendor,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isVendor: user?.role === 'vendor',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};