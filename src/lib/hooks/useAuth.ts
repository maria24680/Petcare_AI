'use client';

import { useAuth as useAuthContext } from '@/lib/auth/auth';
import type { User } from '@/types/user';
import type { RegisterData, VendorRegisterData } from '@/types';

interface UseAuthReturn {
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

export const useAuth = (): UseAuthReturn => {
    const auth = useAuthContext();
    return {
        user: auth.user as User | null,
        loading: auth.loading,
        login: auth.login,
        loginWithGoogle: auth.loginWithGoogle,
        register: auth.register,
        registerWithGoogle: auth.registerWithGoogle,
        registerVendor: auth.registerVendor,
        logout: auth.logout,
        isAuthenticated: auth.isAuthenticated,
        isAdmin: auth.isAdmin,
        isVendor: auth.isVendor,
    };
};