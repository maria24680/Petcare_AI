'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Search, PawPrint, Trash2, Eye, Filter } from 'lucide-react';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';

export default function AdminPetsPage() {
    const [search, setSearch] = useState('');
    const [petType, setPetType] = useState('All');
    const [selectedPet, setSelectedPet] = useState<any>(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['adminPets', search, petType],
        queryFn: async () => {
            const params: any = {};
            if (search) params.search = search;
            if (petType !== 'All') params.petType = petType;
            const response = await apiClient.get('/admin/pets', { params });
            return response.data;
        },
    });

    const deletePet = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/admin/pets/${id}`);
        },
        onSuccess: () => {
            refetch();
        },
    });

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this pet?')) {
            await deletePet.mutateAsync(id);
        }
    };

    const petTypes = ['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">All Pets</h1>
                <p className="text-gray-600 mt-1">Manage all pets across the platform</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 card-shadow mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search pets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <select
                        value={petType}
                        onChange={(e) => setPetType(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694]"
                    >
                        {petTypes.map((type) => (
                            <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Pets Grid */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((pet: any) => (
                        <div key={pet._id} className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-lg transition">
                            <div className="relative h-48">
                                <img
                                    src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                                    alt={pet.petName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => setSelectedPet(pet)}
                                        className="bg-white/90 p-1.5 rounded-lg hover:bg-white transition"
                                    >
                                        <Eye className="w-4 h-4 text-[#111844]" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pet._id)}
                                        className="bg-white/90 p-1.5 rounded-lg hover:bg-red-50 transition"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-[#111844]">{pet.petName}</h3>
                                        <p className="text-sm text-gray-500">{pet.breed}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${pet.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {pet.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                    <span>{pet.petType}</span>
                                    <span>•</span>
                                    <span>{pet.age} years</span>
                                    <span>•</span>
                                    <span>{pet.weight} kg</span>
                                </div>
                                {pet.owner && (
                                    <p className="mt-2 text-xs text-gray-400">
                                        Owner: {pet.owner.fullName}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data?.data?.length === 0 && !isLoading && (
                <div className="bg-white rounded-xl p-12 text-center card-shadow">
                    <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#111844] mb-2">No Pets Found</h3>
                    <p className="text-gray-500">Try adjusting your filters</p>
                </div>
            )}

            {/* Pet Details Modal */}
            <Modal
                isOpen={!!selectedPet}
                onClose={() => setSelectedPet(null)}
                title={selectedPet?.petName}
                size="lg"
            >
                {selectedPet && (
                    <div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={selectedPet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                                    alt={selectedPet.petName}
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>
                            <div>
                                <dl className="space-y-3">
                                    <div>
                                        <dt className="text-sm text-gray-500">Type</dt>
                                        <dd className="font-medium">{selectedPet.petType}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Breed</dt>
                                        <dd className="font-medium">{selectedPet.breed}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Age</dt>
                                        <dd className="font-medium">{selectedPet.age} years</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Weight</dt>
                                        <dd className="font-medium">{selectedPet.weight} kg</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Description</dt>
                                        <dd className="text-gray-600">{selectedPet.description}</dd>
                                    </div>
                                    {selectedPet.owner && (
                                        <div>
                                            <dt className="text-sm text-gray-500">Owner</dt>
                                            <dd className="font-medium">{selectedPet.owner.fullName}</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}