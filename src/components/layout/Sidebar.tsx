'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    PawPrint,
    Heart,
    Bot,
    Store,
    Users,
    Shield,
    LogOut,
    Award,
    User,
    Star,
    TrendingUp,
    Plus,
    Edit,
    Trash2,
    Package,
    Home
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

    // User Navigation
    const userNavItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/pets', label: 'My Pets', icon: Heart },
        { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
        { href: '/dashboard/food-recommendation', label: 'Food Recommendations', icon: Award },
        { href: '/dashboard/favorites', label: 'Favorites', icon: Star },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    // Vendor Navigation - FIXED paths
    const vendorNavItems = [
        { href: 'vendor/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/vendor/pets', label: 'My Pets', icon: PawPrint },
        { href: '/dashboard/vendor/add-pet', label: 'Add Pet', icon: Plus },
        { href: '/dashboard/vendor/products', label: 'Products', icon: Package },
        { href: '/dashboard/vendor/services', label: 'Services', icon: Store },
        { href: '/dashboard/vendor/analytics', label: 'Analytics', icon: TrendingUp },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
    ];

    // Admin Navigation - FIXED paths
    const adminNavItems = [
        { href: 'admin/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/admin/users', label: 'Users', icon: Users },
        { href: '/dashboard/admin/vendors', label: 'Vendors', icon: Store },
        { href: '/dashboard/admin/pets', label: 'Pets', icon: PawPrint },
    ];

    const getNavItems = () => {
        if (user?.role === 'admin') return adminNavItems;
        if (user?.role === 'vendor') return vendorNavItems;
        return userNavItems;
    };

    const navItems = getNavItems();

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#111844] text-white overflow-y-auto">
            <div className="p-6">
                {/* Logo with Home Link */}
                <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition">
                    <PawPrint className="w-8 h-8 text-[#EAE0CF]" />
                    <span className="text-xl font-bold">PetCare AI</span>
                </Link>


                <div className="mb-6 px-4 py-3 bg-[#4B5694]/20 rounded-lg">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="font-semibold text-sm truncate">{user?.fullName}</p>
                    <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${user?.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                        user?.role === 'vendor' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-green-500/20 text-green-300'
                        }`}>
                        {user?.role || 'User'}
                    </span>
                </div>

                <nav className="space-y-1">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive(href)
                                ? 'bg-[#4B5694] text-white'
                                : 'text-gray-300 hover:bg-[#4B5694]/30 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#4B5694]/30">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#4B5694]/30 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}