'use client';

import { useAuth as useAuthContext } from '@/lib/auth/auth';

export const useAuth = () => {
    const auth = useAuthContext();
    return auth;
};