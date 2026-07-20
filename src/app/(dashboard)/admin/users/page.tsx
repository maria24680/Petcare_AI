'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Search, Users, UserCheck, UserX, Shield, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminUsersPage() {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    const { data, isLoading } = useQuery({
        queryKey: ['adminUsers', search, roleFilter],
        queryFn: async () => {
            const params: any = {};
            if (search) params.search = search;
            if (roleFilter !== 'All') params.role = roleFilter;
            const response = await apiClient.get('/users/all', { params });
            return response.data;
        },
    });

    const getRoleBadge = (role: string) => {
        const styles = {
            admin: 'bg-red-100 text-red-700',
            vendor: 'bg-blue-100 text-blue-700',
            user: 'bg-green-100 text-green-700',
        };
        return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    const getRoleIcon = (role: string) => {
        const icons = {
            admin: <Shield className="w-4 h-4" />,
            vendor: <UserCheck className="w-4 h-4" />,
            user: <Users className="w-4 h-4" />,
        };
        return icons[role as keyof typeof icons] || <Users className="w-4 h-4" />;
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">User Management</h1>
                <p className="text-gray-600 mt-1">Manage all users across the platform</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 card-shadow mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694]"
                    >
                        <option value="All">All Roles</option>
                        <option value="user">Users</option>
                        <option value="vendor">Vendors</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="bg-white rounded-xl card-shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F8F6F2] border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.data?.map((user: any) => (
                                    <tr key={user._id} className="hover:bg-[#F8F6F2] transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-[#4B5694]/10 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-[#4B5694]">
                                                        {user.fullName?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-[#111844]">
                                                    {user.fullName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.isVerified
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {user.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {data?.data?.length === 0 && (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}