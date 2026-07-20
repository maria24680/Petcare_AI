'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, googleProvider, getSession } from './auth-client';
import { apiClient } from '@/lib/api/client';

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin' | 'vendor';
  profileImage?: string;
  phone?: string;
  address?: string;
  vendorDetails?: any;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: any) => Promise<void>;
  registerWithGoogle: () => Promise<void>;
  registerVendor: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Builds a minimal fallback user from a Better Auth session when the
// Express backend doesn't have (or couldn't return) a matching profile yet.
function buildFallbackUser(sessionUser: any, role: User['role'] = 'user'): User {
  return {
    _id: sessionUser.id,
    email: sessionUser.email,
    username: sessionUser.email?.split('@')[0] || 'user',
    fullName: sessionUser.name || 'User',
    role,
    profileImage: sessionUser.image || '',
    isVerified: true,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      // Try to get session from better-auth
      try {
        const session = await getSession();
        if (session?.data?.user) {
          const fallbackUser = buildFallbackUser(session.data.user);
          localStorage.setItem('user', JSON.stringify(fallbackUser));
          setUser(fallbackUser);
        }
      } catch {
        // No session, continue
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Better Auth Email Login
  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      // After Better Auth login, fetch the full profile from your backend
      try {
        const response = await apiClient.get(`/users/profile/${result?.data?.user?.id}`);
        if (response.data.success) {
          const profile = response.data.data;
          localStorage.setItem('user', JSON.stringify(profile));
          setUser(profile);

          // Redirect based on role
          if (profile.role === 'admin') {
            router.push('/dashboard/admin/dashboard');
          } else if (profile.role === 'vendor') {
            router.push('/dashboard/vendor/dashboard');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      } catch {
        // Backend profile lookup failed — fall back to session data
      }

      const sessionUser = result?.data?.user;
      if (sessionUser) {
        const fallbackUser = buildFallbackUser(sessionUser);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        router.push('/dashboard');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  // ✅ Better Auth Email Register
  const register = async (formValues: any) => {
    try {
      const result = await authClient.signUp.email({
        email: formValues.email,
        password: formValues.password,
        name: formValues.fullName,
        callbackURL: '/dashboard',
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Registration failed');
      }

      // After Better Auth registration, create the full profile in your backend
      try {
        const response = await apiClient.post('/users/register', {
          ...formValues,
          _id: result?.data?.user?.id,
        });

        if (response.data.success) {
          const profile = response.data.data;
          localStorage.setItem('user', JSON.stringify(profile));
          setUser(profile);
          router.push('/dashboard');
          return;
        }
      } catch {
        // Backend registration failed — fall back to session data, but keep
        // everything the person actually typed instead of discarding it.
      }

      const sessionUser = result?.data?.user;
      if (sessionUser) {
        const fallbackUser: User = {
          ...buildFallbackUser(sessionUser),
          username: formValues.username || sessionUser.email?.split('@')[0] || 'user',
          fullName: formValues.fullName || sessionUser.name || 'User',
          phone: formValues.phone,
          address: formValues.address,
        };
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        router.push('/dashboard');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  // ✅ Better Auth Vendor Register
  const registerVendor = async (formValues: any) => {
    try {
      const result = await authClient.signUp.email({
        email: formValues.email,
        password: formValues.password,
        name: formValues.fullName,
        callbackURL: '/dashboard/vendor/dashboard',
      });

      if (result?.error) {
        throw new Error(result.error.message || 'Vendor registration failed');
      }

      // After Better Auth registration, create the full vendor profile in your backend
      try {
        const response = await apiClient.post('/vendors/register', {
          ...formValues,
          _id: result?.data?.user?.id,
          contactEmail: formValues.contactEmail || formValues.email,
          contactPhone: formValues.contactPhone || formValues.phone,
        });

        if (response.data.success) {
          const profile = response.data.data;
          localStorage.setItem('user', JSON.stringify(profile));
          setUser(profile);
          router.push('/dashboard/vendor/dashboard');
          return;
        }
      } catch (backendError: any) {
        // Surface the backend's actual validation message instead of
        // silently falling back — vendor profiles have required business
        // fields that are worth knowing about if they're missing/invalid.
        throw new Error(
          backendError.response?.data?.message || 'Vendor profile creation failed'
        );
      }

      const sessionUser = result?.data?.user;
      if (sessionUser) {
        const fallbackUser: User = {
          ...buildFallbackUser(sessionUser, 'vendor'),
          username: formValues.username || sessionUser.email?.split('@')[0] || 'user',
          fullName: formValues.fullName || sessionUser.name || 'User',
          phone: formValues.phone,
          address: formValues.address,
        };
        localStorage.setItem('user', JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        router.push('/dashboard/vendor/dashboard');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Vendor registration failed');
    }
  };

  // ✅ Better Auth Google Login
  const loginWithGoogle = async () => {
    try {
      await googleProvider.signIn();
      // After Google redirect, user will be redirected to /dashboard
      // The checkAuth() will handle the session
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error('Google login failed. Please try again.');
    }
  };

  // ✅ Better Auth Google Register
  const registerWithGoogle = async () => {
    try {
      await googleProvider.signIn();
      // After Google redirect, user will be redirected to /dashboard
      // The checkAuth() will handle the session
    } catch (error: any) {
      console.error('Google registration error:', error);
      throw new Error('Google registration failed. Please try again.');
    }
  };

  // ✅ Better Auth Logout
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

  const value = {
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