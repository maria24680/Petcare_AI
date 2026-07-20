'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { Users, PawPrint, Store, UserCheck, Heart, Bot, Award, Star } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/dashboard');
            return response.data.data;
        },
        enabled: user?.role === 'admin',
    });

    const statsCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-[#4B5694]' },
        { label: 'Total Pets', value: stats?.totalPets || 0, icon: PawPrint, color: 'bg-[#7288AE]' },
        { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: Store, color: 'bg-[#111844]' },
        { label: 'Total Admins', value: stats?.totalAdmins || 0, icon: UserCheck, color: 'bg-[#EAE0CF] text-[#111844]' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.fullName}! 👋</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 card-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-[#111844] mt-1">
                                    {isLoading ? '...' : stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/dashboard/pets"
                    className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#4B5694]/10 rounded-lg flex items-center justify-center group-hover:bg-[#4B5694]/20 transition">
                            <Heart className="w-6 h-6 text-[#4B5694]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#111844]">My Pets</h3>
                            <p className="text-sm text-gray-500">View all your pets</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/ai-assistant"
                    className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#7288AE]/10 rounded-lg flex items-center justify-center group-hover:bg-[#7288AE]/20 transition">
                            <Bot className="w-6 h-6 text-[#7288AE]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#111844]">AI Assistant</h3>
                            <p className="text-sm text-gray-500">Get pet care advice</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/food-recommendation"
                    className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#EAE0CF] rounded-lg flex items-center justify-center group-hover:bg-[#EAE0CF]/70 transition">
                            <Award className="w-6 h-6 text-[#111844]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#111844]">Food Recommendations</h3>
                            <p className="text-sm text-gray-500">Get AI-powered food advice</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}