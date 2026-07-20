'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { ArrowLeft, Edit, Trash2, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function PetDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: pet, isLoading } = useQuery({
        queryKey: ['pet', id],
        queryFn: async () => {
            const response = await apiClient.get(`/pets/${id}`);
            return response.data.data;
        },
    });

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this pet?')) return;
        try {
            await apiClient.delete(`/pets/${id}`);
            router.push('/dashboard/pets');
        } catch (error) {
            alert('Failed to delete pet');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5694]"></div>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-[#111844]">Pet not found</h2>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/pets"
                        className="text-gray-500 hover:text-[#111844] transition"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-[#111844]">{pet.petName}</h1>
                        <p className="text-gray-600 mt-1">{pet.breed} • {pet.age} years old</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-red-500 transition rounded-lg hover:bg-red-50">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-[#4B5694] transition rounded-lg hover:bg-[#4B5694]/10">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <Link
                        href={`/dashboard/pets/edit/${pet._id}`}
                        className="bg-[#4B5694] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7288AE] transition"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                        alt={pet.petName}
                        className="w-full h-96 object-cover rounded-xl card-shadow"
                    />
                </div>
                <div className="bg-white rounded-xl p-6 card-shadow">
                    <h2 className="text-xl font-semibold text-[#111844] mb-4">Pet Information</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Name</span>
                            <span className="font-semibold">{pet.petName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Type</span>
                            <span className="font-semibold">{pet.petType}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Breed</span>
                            <span className="font-semibold">{pet.breed}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Age</span>
                            <span className="font-semibold">{pet.age} years</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Weight</span>
                            <span className="font-semibold">{pet.weight} kg</span>
                        </div>
                        <div className="border-b pb-2">
                            <span className="text-gray-600 block mb-1">Description</span>
                            <p className="text-[#111844]">{pet.description}</p>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Public Profile</span>
                            <span className={`font-semibold ${pet.isPublic ? 'text-green-600' : 'text-red-600'}`}>
                                {pet.isPublic ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {pet.relatedPets && pet.relatedPets.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-[#111844] mb-4">Related Pets</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {pet.relatedPets.map((related: any) => (
                            <Link
                                key={related._id}
                                href={`/dashboard/pets/${related._id}`}
                                className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-lg transition"
                            >
                                <img
                                    src={related.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                                    alt={related.petName}
                                    className="w-full h-32 object-cover"
                                />
                                <div className="p-3">
                                    <p className="font-semibold text-sm">{related.petName}</p>
                                    <p className="text-xs text-gray-500">{related.breed}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}