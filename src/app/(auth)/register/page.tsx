'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, PawPrint, Phone, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth';

function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
                fill="#4285F4"
                d="M23.52 12.27c0-.85-.08-1.66-.22-2.44H12v4.62h6.46c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.8z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.1C3.23 21.3 7.3 24 12 24z"
            />
            <path
                fill="#FBBC05"
                d="M5.27 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.6H1.26A11.96 11.96 0 000 12c0 1.93.46 3.76 1.26 5.4l4.01-3.11z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.3 0 3.23 2.7 1.26 6.6l4.01 3.1c.95-2.85 3.6-4.95 6.73-4.95z"
            />
        </svg>
    );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
    email: string;
    username: string;
    fullName: string;
    password: string;
    phone: string;
    address: string;
}

interface FormErrors {
    email?: string;
    username?: string;
    fullName?: string;
    password?: string;
}

export default function RegisterPage() {
    const { register, registerWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormValues>({
        email: '',
        username: '',
        fullName: '',
        password: '',
        phone: '',
        address: '',
    });

    const validate = (values: FormValues): FormErrors => {
        const next: FormErrors = {};
        if (!values.fullName.trim()) next.fullName = 'Full name is required';
        if (!values.username.trim()) next.username = 'Username is required';

        if (!values.email.trim()) {
            next.email = 'Email is required';
        } else if (!EMAIL_REGEX.test(values.email)) {
            next.email = 'Enter a valid email address';
        }

        if (!values.password) {
            next.password = 'Password is required';
        } else if (values.password.length < 8) {
            next.password = 'Password must be at least 8 characters';
        }

        return next;
    };

    const handleChange = (field: keyof FormValues, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register(formData);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            await registerWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google registration failed. Please try again.');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F6F2]">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4B5694]/10 rounded-full mb-4">
                            <PawPrint className="w-8 h-8 text-[#4B5694]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#111844]">Create Account</h2>
                        <p className="text-gray-600 mt-1">Join PetCare AI as a pet parent</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={googleLoading || loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-[#111844] py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 mb-4"
                    >
                        {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                        {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">or sign up with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.fullName ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-[#4B5694]'
                                        }`}
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                />
                            </div>
                            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Username *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.username ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-[#4B5694]'
                                        }`}
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                />
                            </div>
                            {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.email ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-[#4B5694]'
                                        }`}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.password ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-[#4B5694]'
                                        }`}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Phone
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                    placeholder="+1234567890"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Address
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                    placeholder="123 Main St, City"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-full flex items-center justify-center gap-2 bg-[#111844] text-white py-3 rounded-lg font-semibold hover:bg-[#4B5694] transition disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#4B5694] font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                            Want to sell pets?{' '}
                            <Link href="/vendor-register" className="text-[#4B5694] font-semibold hover:underline">
                                Register as Vendor
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}