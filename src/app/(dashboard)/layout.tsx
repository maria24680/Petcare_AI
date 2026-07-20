'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    // Check if user has access to admin routes
    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            if (pathname?.includes('/admin') && user.role !== 'admin') {
                router.push('/dashboard');
            }
            if (pathname?.includes('/vendor') && user.role !== 'vendor' && user.role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [pathname, user, isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5694]"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex min-h-screen bg-[#F8F6F2]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
    );
}