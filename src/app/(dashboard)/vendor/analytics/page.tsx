'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, Package, Heart } from 'lucide-react';

const COLORS = ['#111844', '#4B5694', '#7288AE', '#EAE0CF'];

export default function VendorAnalyticsPage() {
    const { user } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['vendorAnalytics', user?._id],
        queryFn: async () => {
            if (!user?._id) return null;
            const response = await apiClient.get(`/vendors/${user._id}`);
            return response.data.data.stats;
        },
        enabled: !!user?._id,
    });

    const chartData = [
        { name: 'Jan', pets: 4, products: 3 },
        { name: 'Feb', pets: 6, products: 5 },
        { name: 'Mar', pets: 8, products: 7 },
        { name: 'Apr', pets: 10, products: 9 },
        { name: 'May', pets: 12, products: 11 },
        { name: 'Jun', pets: 15, products: 13 },
    ];

    const petTypeData = [
        { name: 'Dogs', value: 40 },
        { name: 'Cats', value: 30 },
        { name: 'Birds', value: 15 },
        { name: 'Others', value: 15 },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5694]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">Analytics</h1>
                <p className="text-gray-600 mt-1">Track your business performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 card-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4B5694]/10 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-[#4B5694]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Pets</p>
                            <p className="text-2xl font-bold text-[#111844]">{stats?.totalPets || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 card-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#7288AE]/10 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-[#7288AE]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-[#111844]">{stats?.totalProducts || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-6 card-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#EAE0CF] rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#111844]" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Reviews</p>
                            <p className="text-2xl font-bold text-[#111844]">{stats?.totalReviews || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 card-shadow">
                    <h3 className="text-lg font-semibold text-[#111844] mb-4">Monthly Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pets" fill="#4B5694" />
                            <Bar dataKey="products" fill="#7288AE" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 card-shadow">
                    <h3 className="text-lg font-semibold text-[#111844] mb-4">Pet Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={petTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {petTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}