'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { Users, PawPrint, Store, UserCheck } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import StatCard from '@/components/shared/StatCard';

const COLORS = ['#111844', '#4B5694', '#7288AE', '#EAE0CF'];

export default function AdminDashboardPage() {
    const { user } = useAuth();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/dashboard');
            return response.data.data;
        },
        enabled: user?.role === 'admin',
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5694]"></div>
            </div>
        );
    }

    const statsCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-[#4B5694]' },
        { label: 'Total Pets', value: stats?.totalPets || 0, icon: PawPrint, color: 'bg-[#7288AE]' },
        { label: 'Total Vendors', value: stats?.totalVendors || 0, icon: Store, color: 'bg-[#111844]' },
        { label: 'Total Admins', value: stats?.totalAdmins || 0, icon: UserCheck, color: 'bg-[#EAE0CF] text-[#111844]' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your platform overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        isLoading={isLoading}
                    />
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 card-shadow">
                    <h3 className="text-lg font-semibold text-[#111844] mb-4">Pet Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats?.petTypeDistribution || []}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {(stats?.petTypeDistribution || []).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 card-shadow">
                    <h3 className="text-lg font-semibold text-[#111844] mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {stats?.recentPets?.slice(0, 5).map((pet: any) => (
                            <div key={pet._id} className="flex items-center gap-3 border-b pb-3">
                                <div className="w-10 h-10 bg-[#4B5694]/10 rounded-full flex items-center justify-center">
                                    <PawPrint className="w-5 h-5 text-[#4B5694]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#111844]">{pet.petName}</p>
                                    <p className="text-xs text-gray-500">Added {new Date(pet.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}