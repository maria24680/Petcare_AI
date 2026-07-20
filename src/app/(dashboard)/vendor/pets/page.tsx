'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';
import { Plus, PawPrint, Edit, Trash2, Eye } from 'lucide-react';

export default function VendorPetsPage() {
    const { user } = useAuth();

    // Support either `_id` (Mongo convention) or `id`, whichever the backend/auth layer actually returns
    const userId = user?._id || user?.id;

    const { data: pets, isLoading, refetch } = useQuery({
        queryKey: ['vendorPets', userId],
        queryFn: async () => {
            const response = await apiClient.get(`/vendors/${userId}/pets`);
            return response.data.data;
        },
        enabled: !!userId,
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this pet?')) return;
        try {
            await apiClient.delete(`/pets/${id}`);
            refetch();
        } catch (error) {
            alert('Failed to delete pet');
        }
    };

    // Treat missing/undefined data the same as an empty list, so the page never renders blank
    const petList = pets ?? [];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#111844]">My Listed Pets</h1>
                    <p className="text-gray-600 mt-1">Manage your pet listings</p>
                </div>
                <Link
                    href="/vendor/add-pet"
                    className="bg-[#111844] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4B5694] transition"
                >
                    <Plus className="w-4 h-4" />
                    List New Pet
                </Link>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl p-6 card-shadow animate-pulse">
                            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : petList.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center card-shadow">
                    <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#111844] mb-2">No Pets Listed</h3>
                    <p className="text-gray-500 mb-4">Start listing your pets for sale</p>
                    <Link
                        href="/vendor/add-pet"
                        className="bg-[#111844] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#4B5694] transition"
                    >
                        <Plus className="w-4 h-4" />
                        List Your First Pet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {petList.map((pet: any) => (
                        <div key={pet._id} className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-lg transition">
                            <div className="relative h-48">
                                <img
                                    src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                                    alt={pet.petName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${pet.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {pet.isAvailable ? 'Available' : 'Sold'}
                                    </span>
                                </div>
                                {pet.price && (
                                    <div className="absolute bottom-2 left-2 bg-[#111844] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                                        ${pet.price}
                                    </div>
                                )}
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
                                        className="flex-1 text-center bg-[#4B5694] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#7288AE] transition flex items-center justify-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(pet._id)}
                                        className="flex-1 text-center bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition flex items-center justify-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}