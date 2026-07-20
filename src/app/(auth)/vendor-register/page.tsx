'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Mail, Lock, User, Eye, EyeOff, Phone,
    Store, Building, FileText, Globe, Loader2, Chrome
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
    email: string;
    username: string;
    fullName: string;
    password: string;
    phone: string;
    address: string;
    businessName: string;
    businessType: string;
    businessLicense: string;
    taxId: string;
    website: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    services: string[];
}

interface FormErrors {
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
    businessName?: string;
    description?: string;
}

export default function VendorRegisterPage() {
    const { registerVendor, loginWithGoogle, loading: authLoading } = useAuth();
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
        businessName: '',
        businessType: 'Pet Store',
        businessLicense: '',
        taxId: '',
        website: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        services: [],
    });

    const businessTypes = [
        'Pet Store',
        'Pet Grooming',
        'Pet Boarding',
        'Pet Training',
        'Veterinary Clinic',
        'Other'
    ];

    const serviceOptions = [
        'Pet Grooming',
        'Pet Boarding',
        'Pet Training',
        'Pet Sitting',
        'Dog Walking',
        'Veterinary Services',
        'Pet Transport',
        'Pet Supplies'
    ];

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

        if (!values.businessName.trim()) next.businessName = 'Business name is required';
        if (!values.description.trim()) next.description = 'Business description is required';

        return next;
    };

    const handleChange = (field: keyof FormValues, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (error) setError('');
    };

    const handleServiceToggle = (service: string) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
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
            await registerVendor(formData);
        } catch (err: any) {
            setError(err.message || 'Vendor registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Google registration failed. Please try again.');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#F8F6F2]">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4B5694]/10 rounded-full mb-4">
                            <Store className="w-8 h-8 text-[#4B5694]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#111844]">Register as Vendor</h2>
                        <p className="text-gray-600 mt-1">Start selling pets and pet services</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Google Register Button */}
                    <button
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={googleLoading || loading || authLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-[#111844] py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 mb-4"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-3 text-gray-400">or sign up with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <h3 className="text-lg font-semibold text-[#111844] border-b pb-2">Account Information</h3>

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

                        <h3 className="text-lg font-semibold text-[#111844] border-b pb-2 mt-6">Business Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Business Name *
                            </label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.businessName ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-[#4B5694]'
                                        }`}
                                    placeholder="Pet Paradise"
                                    value={formData.businessName}
                                    onChange={(e) => handleChange('businessName', e.target.value)}
                                />
                            </div>
                            {errors.businessName && <p className="text-xs text-red-600 mt-1">{errors.businessName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Business Type *
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent appearance-none"
                                    value={formData.businessType}
                                    onChange={(e) => handleChange('businessType', e.target.value)}
                                >
                                    {businessTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Business Description *
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <textarea
                                    rows={4}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${errors.description ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-[#4B5694]'
                                        }`}
                                    placeholder="Describe your pet business..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </div>
                            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
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
                                Website (Optional)
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="url"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                    placeholder="https://www.example.com"
                                    value={formData.website}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Contact Email (Optional)
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                    placeholder="business@example.com"
                                    value={formData.contactEmail}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-3">
                                Services You Offer
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {serviceOptions.map((service) => (
                                    <label
                                        key={service}
                                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.services.includes(service)}
                                            onChange={() => handleServiceToggle(service)}
                                            className="w-4 h-4 text-[#4B5694] rounded focus:ring-[#4B5694]"
                                        />
                                        {service}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || googleLoading || authLoading}
                            className="w-full flex items-center justify-center gap-2 bg-[#111844] text-white py-3 rounded-lg font-semibold hover:bg-[#4B5694] transition disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Registering...' : 'Register as Vendor'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#4B5694] font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Not a vendor?{' '}
                            <Link href="/register" className="text-[#4B5694] font-semibold hover:underline">
                                Register as Pet Parent
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}