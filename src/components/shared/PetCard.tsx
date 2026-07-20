'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Pet } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { PawPrint, Heart, Eye } from 'lucide-react';

interface PetCardProps {
    pet: Pet;
    showActions?: boolean;
    onDelete?: (id: string) => void;
    onFavorite?: (id: string) => void;
    isFavorite?: boolean;
    variant?: 'grid' | 'list';
}

const PetCard = ({
    pet,
    showActions = false,
    onDelete,
    onFavorite,
    isFavorite = false,
    variant = 'grid'
}: PetCardProps) => {
    if (variant === 'list') {
        return (
            <Card className="group hover:shadow-lg transition">
                <div className="flex flex-col sm:flex-row">
                    <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
                        <img
                            src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                            alt={pet.petName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <CardContent className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-[#111844] text-lg">{pet.petName}</h3>
                                <p className="text-sm text-gray-500">{pet.breed}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${pet.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {pet.isPublic ? 'Public' : 'Private'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Age: {pet.age} years</span>
                            <span>Weight: {pet.weight} kg</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{pet.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                            <Link
                                href={`/dashboard/pets/${pet._id}`}
                                className="inline-flex items-center gap-1 text-[#4B5694] font-semibold hover:underline text-sm"
                            >
                                <Eye className="w-3 h-3" />
                                View Details
                            </Link>
                            {onFavorite && (
                                <button
                                    onClick={() => onFavorite(pet._id!)}
                                    className={`ml-auto p-1.5 rounded-lg transition ${isFavorite ? 'bg-red-50 text-red-500' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                                </button>
                            )}
                            {showActions && onDelete && (
                                <button
                                    onClick={() => onDelete(pet._id!)}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </CardContent>
                </div>
            </Card>
        );
    }

    return (
        <Card className="group hover:shadow-lg transition">
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                    src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                    alt={pet.petName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    {onFavorite && (
                        <button
                            onClick={() => onFavorite(pet._id!)}
                            className={`p-1.5 rounded-lg transition ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 hover:bg-white'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                        </button>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${pet.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {pet.isPublic ? 'Public' : 'Private'}
                    </span>
                </div>
                {pet.price && (
                    <div className="absolute bottom-2 left-2 bg-[#111844] text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        ${pet.price}
                    </div>
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold text-[#111844] text-lg truncate">
                    {pet.petName}
                </h3>
                <p className="text-sm text-gray-500">{pet.breed}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span>Age: {pet.age}y</span>
                    <span>Weight: {pet.weight}kg</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {pet.description}
                </p>
                <div className="mt-4 flex items-center gap-2">
                    <Link
                        href={`/dashboard/pets/${pet._id}`}
                        className="inline-flex items-center gap-1 text-[#4B5694] font-semibold hover:underline text-sm"
                    >
                        <Eye className="w-3 h-3" />
                        View Details
                    </Link>
                    {showActions && onDelete && (
                        <button
                            onClick={() => onDelete(pet._id!)}
                            className="ml-auto text-sm text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PetCard;