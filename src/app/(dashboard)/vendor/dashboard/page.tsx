'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Store, Package, Heart, Users, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboardPage() {
    const { user } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['vendorStats', user?._id],
        queryFn: async () => {
            if (!user?._id) return null;
            const response = await apiClient.get(`/vendors/${user._id}`);
            return response.data.data.stats;
        },
        enabled: !!user?._id,
    });

    const statsCards = [
        {
            label: 'Total Pets',
            value: stats?.totalPets || 0,
            icon: Heart,
            color: 'bg-[#4B5694]'
        },
        {
            label: 'Total Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-[#7288AE]'
        },
        {
            label: 'Total Services',
            value: stats?.totalServices || 0,
            icon: Store,
            color: 'bg-[#111844]'
        },
        {
            label: 'Total Reviews',
            value: stats?.totalReviews || 0,
            icon: Users,
            color: 'bg-[#EAE0CF] text-[#111844]'
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#111844]">Vendor Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your pet business</p>
                </div>
                <Link
                    href="/dashboard/vendor/add-pet"
                    className="bg-[#111844] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4B5694] transition"
                >
                    <Plus className="w-4 h-4" />
                    List a Pet
                </Link>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/dashboard/vendor/pets"
                    className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#4B5694]/10 rounded-lg flex items-center justify-center group-hover:bg-[#4B5694]/20 transition">
                            <Heart className="w-6 h-6 text-[#4B5694]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#111844]">My Pets</h3>
                            <p className="text-sm text-gray-500">Manage your pet listings</p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/dashboard/vendor/analytics"
                    className="bg-white rounded-xl p-6 card-shadow hover:shadow-lg transition group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#7288AE]/10 rounded-lg flex items-center justify-center group-hover:bg-[#7288AE]/20 transition">
                            <TrendingUp className="w-6 h-6 text-[#7288AE]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#111844]">Analytics</h3>
                            <p className="text-sm text-gray-500">View your performance</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}