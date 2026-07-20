'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Menu, X, PawPrint, LogOut, LayoutDashboard, Store, Bot, Heart, ChevronDown, User, Shield, Award,
    Info, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin
} from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        router.push('/');
    };

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

    const navLinks = [
        { href: '/all-pets', label: 'Explore Pets', icon: PawPrint },
        { href: '/about', label: 'About', icon: Info },
        { href: '/contact', label: 'Contact', icon: Mail },
    ];

    const getDashboardLinks = () => {
        const links = [
            { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/dashboard/pets', label: 'My Pets', icon: Heart },
            { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
            { href: '/dashboard/food-recommendation', label: 'Food Recommendations', icon: Award },
            { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
            { href: '/dashboard/profile', label: 'Profile', icon: User },
        ];

        if (user?.role === 'admin') {
            links.push({ href: '/dashboard/admin/dashboard', label: 'Admin Panel', icon: Shield });
        }

        if (user?.role === 'vendor') {
            links.push({ href: '/dashboard/vendor/dashboard', label: 'Vendor Dashboard', icon: Store });
        }

        return links;
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#111844] shadow-lg' : 'bg-[#111844]/95'
            }`}>
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
                        <PawPrint className="w-8 h-8 text-[#EAE0CF]" />
                        <span className="text-xl font-bold text-white">PetCare AI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`text-sm transition ${isActive(href)
                                    ? 'text-[#EAE0CF] font-semibold'
                                    : 'text-gray-300 hover:text-[#EAE0CF]'
                                    }`}
                            >
                                {label}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 text-white hover:text-[#EAE0CF] transition"
                                >
                                    <div className="w-8 h-8 bg-[#4B5694] rounded-full flex items-center justify-center">
                                        <span className="text-sm font-semibold">
                                            {user?.fullName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 card-shadow">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-[#111844]">{user?.fullName}</p>
                                            <p className="text-sm text-gray-500">{user?.email}</p>
                                            <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                user?.role === 'vendor' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {user?.role || 'User'}
                                            </span>
                                        </div>

                                        <div className="py-2 max-h-64 overflow-y-auto">
                                            {getDashboardLinks().map(({ href, label, icon: Icon }) => (
                                                <Link
                                                    key={href}
                                                    href={href}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-[#EAE0CF] transition"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    {label}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="border-t border-gray-100 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition w-full"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-[#EAE0CF] transition text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-[#EAE0CF] text-[#111844] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-[#4B5694]/30">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`block py-2 text-sm transition ${isActive(href)
                                    ? 'text-[#EAE0CF] font-semibold'
                                    : 'text-gray-300 hover:text-[#EAE0CF]'
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <div className="py-2 border-t border-[#4B5694]/30 mt-2 max-h-64 overflow-y-auto">
                                    {getDashboardLinks().map(({ href, label }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            className="block py-2 text-sm text-gray-300 hover:text-[#EAE0CF] transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {label}
                                        </Link>
                                    ))}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 py-2 text-sm text-red-400 hover:text-red-300 transition w-full"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 pt-2 border-t border-[#4B5694]/30">
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-[#EAE0CF] transition text-sm py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-[#EAE0CF] text-[#111844] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition text-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="/vendor-register"
                                    className="border border-[#EAE0CF] text-[#EAE0CF] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#EAE0CF] hover:text-[#111844] transition text-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register as Vendor
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}