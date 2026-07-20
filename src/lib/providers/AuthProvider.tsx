'use client';

import { AuthProvider as BetterAuthProvider } from '@/lib/auth/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <BetterAuthProvider>{children}</BetterAuthProvider>;
}