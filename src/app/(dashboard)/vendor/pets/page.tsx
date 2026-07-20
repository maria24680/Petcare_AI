'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';
import { Plus, PawPrint, Eye, Trash2, Edit, Loader2 } from 'lucide-react';

export default function VendorPetsPage() {
    const { user } = useAuth();

    // ✅ FIXED: Use only _id from User type
    const userId = user?._id;

    const { data: pets, isLoading, refetch } = useQuery({
        queryKey: ['vendorPets', userId],
        queryFn: async () => {
            if (!userId) return [];
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#4B5694]" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#111844]">My Listed Pets</h1>
                    <p className="text-gray-600 mt-1">Manage your pet listings</p>
                </div>
                <Link
                    href="/dashboard/vendor/add-pet"
                    className="bg-[#111844] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4B5694] transition"
                >
                    <Plus className="w-4 h-4" />
                    List New Pet
                </Link>
            </div>

            {pets?.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center card-shadow">
                    <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#111844] mb-2">No Pets Listed</h3>
                    <p className="text-gray-500 mb-4">Start listing your pets for sale</p>
                    <Link
                        href="/dashboard/vendor/add-pet"
                        className="bg-[#111844] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#4B5694] transition"
                    >
                        <Plus className="w-4 h-4" />
                        List Your First Pet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets?.map((pet: any) => (
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
                                    {pet.price && (
                                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            ${pet.price}
                                        </span>
                                    )}
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
                                        className="flex-1 text-center bg-[#4B5694] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#7288AE] transition flex items-center justify-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </Link>
                                    <Link
                                        href={`/dashboard/vendor/edit-pet/${pet._id}`}
                                        className="flex-1 text-center border border-[#111844] text-[#111844] px-3 py-1.5 rounded-lg text-sm hover:bg-[#111844] hover:text-white transition flex items-center justify-center gap-1"
                                    >
                                        <Edit className="w-3 h-3" />
                                        Edit
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