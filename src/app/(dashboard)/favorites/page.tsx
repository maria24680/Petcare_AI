'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Heart, PawPrint, Search } from 'lucide-react';
import PetCard from '@/components/shared/PetCard';

// Mock favorites data - replace with actual API call
const mockFavorites = [
    {
        _id: '1',
        petName: 'Max',
        petType: 'Dog' as const,
        breed: 'Golden Retriever',
        age: 3,
        weight: 30,
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500',
        description: 'Friendly and energetic Golden Retriever',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        _id: '2',
        petName: 'Luna',
        petType: 'Cat' as const,
        breed: 'Persian',
        age: 2,
        weight: 4,
        imageUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=500',
        description: 'Calm and affectionate Persian cat',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

export default function FavoritesPage() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState(mockFavorites);

    const handleRemoveFavorite = (id: string) => {
        setFavorites(favorites.filter((pet) => pet._id !== id));
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">My Favorites</h1>
                <p className="text-gray-600 mt-1">Pets you've saved for later</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 card-shadow mb-6">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search favorites..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {favorites.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center card-shadow">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#111844] mb-2">No Favorites Yet</h3>
                    <p className="text-gray-500">
                        Start exploring pets and save your favorites
                    </p>
                    <div className="mt-4 flex justify-center gap-4">
                        <a
                            href="/pets"
                            className="bg-[#111844] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-[#4B5694] transition"
                        >
                            <PawPrint className="w-4 h-4" />
                            Explore Pets
                        </a>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((pet) => (
                        <PetCard
                            key={pet._id}
                            pet={pet}
                            isFavorite={true}
                            onFavorite={handleRemoveFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}