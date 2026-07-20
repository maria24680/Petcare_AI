'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';
import { Plus, Search, PawPrint, Filter } from 'lucide-react';
import { useState } from 'react';

export default function PetsPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    const { data: pets, isLoading } = useQuery({
        queryKey: ['userPets', user?._id, search, filterType],
        queryFn: async () => {
            if (!user?._id) return [];
            const params: any = {};
            if (search) params.search = search;
            if (filterType !== 'All') params.petType = filterType;
            const response = await apiClient.get(`/pets/user/${user._id}`, { params });
            return response.data.data;
        },
        enabled: !!user?._id,
    });

    const petTypes = ['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#111844]">My Pets</h1>
                    <p className="text-gray-600 mt-1">Manage all your furry friends</p>
                </div>
                <Link
                    href="/dashboard/pets/add"
                    className="bg-[#111844] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4B5694] transition whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    Add Pet        </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 card-shadow mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search pets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent bg-white"
                    >
                        {petTypes.map((type) => (
                            <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden card-shadow animate-pulse">
                            <div className="w-full h-48 bg-gray-200"></div>
                            <div className="p-4 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : pets?.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center card-shadow">
                    <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#111844] mb-2">No Pets Yet</h3>
                    <p className="text-gray-500 mb-4">Start by adding your first pet</p>
                    <Link
                        href="/dashboard/pets/add"
                        className="bg-[#111844] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#4B5694] transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add Your First Pet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets?.map((pet: any) => (
                        <div key={pet._id} className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-lg transition group">
                            <div className="relative h-48">
                                <img
                                    src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                                    alt={pet.petName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${pet.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {pet.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-[#111844] text-lg">{pet.petName}</h3>
                                <p className="text-sm text-gray-500">{pet.breed}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <span>Age: {pet.age} years</span>
                                    <span>Weight: {pet.weight} kg</span>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <Link
                                        href={`/dashboard/pets/${pet._id}`}
                                        className="flex-1 text-center bg-[#4B5694] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#7288AE] transition"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        href={`/dashboard/pets/edit/${pet._id}`}
                                        className="flex-1 text-center border border-[#111844] text-[#111844] px-3 py-1.5 rounded-lg text-sm hover:bg-[#111844] hover:text-white transition"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}