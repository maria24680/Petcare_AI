'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search, Filter, PawPrint, Heart, ChevronDown,
    Grid3x3, List, X, Star, Calendar, Weight,
    ArrowUpDown, Loader2, AlertCircle
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ExplorePetsPage() {
    // State
    const [search, setSearch] = useState('');
    const [petType, setPetType] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [page, setPage] = useState(1);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Load favorites from localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage
    const toggleFavorite = (petId: string) => {
        const newFavorites = favorites.includes(petId)
            ? favorites.filter(id => id !== petId)
            : [...favorites, petId];
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    // Fetch pets with filters
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ['explorePets', search, petType, sortBy, page],
        queryFn: async () => {
            const params: any = {
                page,
                limit: 12,
                sortBy: sortBy === 'newest' ? 'createdAt' :
                    sortBy === 'oldest' ? 'createdAt' :
                        sortBy === 'weight-asc' ? 'weight' :
                            sortBy === 'weight-desc' ? 'weight' : 'createdAt',
                sortOrder: sortBy === 'newest' || sortBy === 'weight-desc' ? 'desc' : 'asc',
            };

            if (search) params.search = search;
            if (petType !== 'All') params.petType = petType;

            const response = await apiClient.get('/pets', { params });
            return response.data;
        },
        staleTime: 60000,
    });

    // Filter options
    const petTypes = ['All', 'Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];

    const sortOptions = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Weight: Lightest', value: 'weight-asc' },
        { label: 'Weight: Heaviest', value: 'weight-desc' },
    ];

    const pets = data?.data || [];
    const pagination = data?.pagination;

    // Get pet emoji
    const getPetEmoji = (type: string) => {
        const emojis: Record<string, string> = {
            Dog: '🐕',
            Cat: '🐱',
            Bird: '🐦',
            Fish: '🐟',
            Rabbit: '🐰',
            Hamster: '🐹',
            Other: '🐾',
        };
        return emojis[type] || '🐾';
    };

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, petType, sortBy]);

    // Clear all filters
    const clearFilters = () => {
        setSearch('');
        setPetType('All');
        setSortBy('newest');
        setPage(1);
    };

    return (
        <>
            <Navbar />
            <main className="pt-16 bg-[#F8F6F2] min-h-screen">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-[#111844] to-[#4B5694] text-white py-16">
                    <div className="container-custom">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">🐾 Explore Pets</h1>
                        <p className="text-lg text-gray-300 max-w-2xl">
                            Find your perfect furry, feathery, or scaly friend from our trusted community
                        </p>
                        <div className="mt-4 flex items-center gap-6 text-sm text-gray-300">
                            <span>🐕 {pagination?.total || 0} pets available</span>
                            <span>🏪 {data?.vendors || 0} trusted vendors</span>
                            <span>⭐ 4.9/5 average rating</span>
                        </div>
                    </div>
                </section>

                {/* Search & Filters */}
                <section className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
                    <div className="container-custom py-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent transition bg-[#F8F6F2]"
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-[#F8F6F2] transition bg-white"
                            >
                                <Filter className="w-5 h-5" />
                                <span>Filters</span>
                                <ChevronDown className={`w-4 h-4 transition ${isFilterOpen ? 'rotate-180' : ''}`} />
                                {petType !== 'All' && (
                                    <span className="w-2 h-2 bg-[#4B5694] rounded-full"></span>
                                )}
                            </button>

                            {/* Desktop Filters */}
                            <div className="hidden md:flex items-center gap-3 flex-wrap">
                                <div className="relative">
                                    <select
                                        value={petType}
                                        onChange={(e) => setPetType(e.target.value)}
                                        className="px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-[#F8F6F2] appearance-none cursor-pointer hover:border-[#4B5694] transition"
                                    >
                                        {petTypes.map((type) => (
                                            <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-[#F8F6F2] appearance-none cursor-pointer hover:border-[#4B5694] transition"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>

                                {/* View Toggle */}
                                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-[#F8F6F2]">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 transition ${viewMode === 'grid' ? 'bg-[#111844] text-white' : 'hover:bg-[#EAE0CF]'}`}
                                        title="Grid View"
                                    >
                                        <Grid3x3 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 transition ${viewMode === 'list' ? 'bg-[#111844] text-white' : 'hover:bg-[#EAE0CF]'}`}
                                        title="List View"
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Clear Filters */}
                                {(petType !== 'All' || search) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-[#4B5694] hover:underline font-medium"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {isFilterOpen && (
                            <div className="md:hidden mt-4 p-4 bg-[#F8F6F2] rounded-xl space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[#111844] block mb-1">Pet Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {petTypes.map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setPetType(type)}
                                                className={`px-3 py-1.5 rounded-lg text-sm transition ${petType === type
                                                    ? 'bg-[#111844] text-white'
                                                    : 'bg-white hover:bg-[#EAE0CF]'
                                                    }`}
                                            >
                                                {type === 'All' ? 'All' : type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-[#111844] block mb-1">Sort By</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B5694] bg-white"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="flex-1 bg-[#111844] text-white py-2 rounded-xl font-semibold hover:bg-[#4B5694] transition"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-[#EAE0CF] transition"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Results Section */}
                <section className="py-8">
                    <div className="container-custom">
                        {/* Results Count */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <p className="text-sm text-gray-500">
                                {isLoading ? (
                                    'Loading...'
                                ) : pagination ? (
                                    <span>
                                        Showing <strong>{pets.length}</strong> of <strong>{pagination.total}</strong> pets
                                        {(petType !== 'All' || search) && (
                                            <span className="text-[#4B5694]"> (filtered)</span>
                                        )}
                                    </span>
                                ) : (
                                    'No pets found'
                                )}
                            </p>
                            {isFetching && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating...
                                </div>
                            )}
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-red-700 mb-2">Something went wrong</h3>
                                <p className="text-red-600">Failed to load pets. Please try again.</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : pets.length === 0 ? (
                            <div className="bg-white rounded-2xl p-16 text-center card-shadow">
                                <PawPrint className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-[#111844] mb-3">No Pets Found</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    We couldn't find any pets matching your criteria. Try adjusting your filters or search terms.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <button
                                        onClick={clearFilters}
                                        className="bg-[#111844] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#4B5694] transition"
                                    >
                                        Clear All Filters
                                    </button>
                                    <Link
                                        href="/dashboard/pets/add"
                                        className="border-2 border-[#111844] text-[#111844] px-6 py-2.5 rounded-xl font-semibold hover:bg-[#111844] hover:text-white transition"
                                    >
                                        Add Your Pet
                                    </Link>
                                </div>
                            </div>
                        ) : viewMode === 'grid' ? (
                            // Grid View
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {pets.map((pet: any) => (
                                    <div key={pet._id} className="group bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="relative h-56 overflow-hidden bg-gray-100">
                                            <img
                                                src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                                                alt={pet.petName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                                <span className="bg-[#111844]/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                                                    {getPetEmoji(pet.petType)} {pet.petType}
                                                </span>
                                                {pet.isPublic && (
                                                    <span className="bg-green-500/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                                                        Available
                                                    </span>
                                                )}
                                                {pet.price && (
                                                    <span className="bg-yellow-500/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                        ${pet.price}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Favorite Button */}
                                            <button
                                                onClick={() => toggleFavorite(pet._id)}
                                                className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white transition shadow-lg hover:scale-110 active:scale-95"
                                            >
                                                <Heart className={`w-5 h-5 transition ${favorites.includes(pet._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                            </button>

                                            {/* View Details Overlay */}
                                            <Link
                                                href={`/pets/${pet._id}`}
                                                className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                            >
                                                <span className="block w-full text-center bg-[#EAE0CF] text-[#111844] px-4 py-2.5 rounded-xl font-semibold hover:bg-opacity-90 transition shadow-lg">
                                                    View Details
                                                </span>
                                            </Link>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold text-[#111844] text-lg leading-tight">{pet.petName}</h3>
                                                    <p className="text-sm text-gray-500">{pet.breed}</p>
                                                </div>
                                                <div className="flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-xs font-semibold text-green-700">4.8</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Weight className="w-4 h-4" />
                                                    <span>{pet.weight}kg</span>
                                                </div>
                                            </div>

                                            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                {pet.description}
                                            </p>

                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    Added {new Date(pet.createdAt).toLocaleDateString()}
                                                </span>
                                                <Link
                                                    href={`/pets/${pet._id}`}
                                                    className="text-[#4B5694] font-semibold text-sm hover:underline"
                                                >
                                                    Learn More →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // List View
                            <div className="space-y-4">
                                {pets.map((pet: any) => (
                                    <div key={pet._id} className="group bg-white rounded-2xl overflow-hidden card-shadow hover:shadow-xl transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gray-100">
                                                <img
                                                    src={pet.imageUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500'}
                                                    alt={pet.petName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500';
                                                    }}
                                                />
                                                <button
                                                    onClick={() => toggleFavorite(pet._id)}
                                                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition shadow-lg"
                                                >
                                                    <Heart className={`w-5 h-5 ${favorites.includes(pet._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                                </button>
                                                {pet.price && (
                                                    <div className="absolute bottom-3 left-3 bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">
                                                        ${pet.price}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 p-6">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-[#111844] text-xl">{pet.petName}</h3>
                                                        <p className="text-sm text-gray-500">{pet.breed}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-semibold text-green-700">4.8</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1 bg-[#F8F6F2] px-3 py-1 rounded-full">
                                                        {getPetEmoji(pet.petType)} {pet.petType}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-[#F8F6F2] px-3 py-1 rounded-full">
                                                        <Weight className="w-4 h-4" /> {pet.weight} kg
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${pet.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {pet.isPublic ? '✓ Available' : 'Private'}
                                                    </span>
                                                </div>

                                                <p className="mt-3 text-gray-600 line-clamp-2">
                                                    {pet.description}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-3">
                                                    <Link
                                                        href={`/pets/${pet._id}`}
                                                        className="bg-[#4B5694] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#7288AE] transition text-sm shadow-md hover:shadow-lg"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <Link
                                                        href={`/dashboard/pets/${pet._id}`}
                                                        className="border-2 border-[#111844] text-[#111844] px-6 py-2 rounded-lg font-semibold hover:bg-[#111844] hover:text-white transition text-sm"
                                                    >
                                                        Contact Owner
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EAE0CF] transition"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                        let pageNum = i + 1;
                                        if (pagination.totalPages > 5 && page > 3) {
                                            pageNum = page - 2 + i;
                                            if (pageNum > pagination.totalPages) return null;
                                        }
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded-xl font-semibold transition ${page === pageNum
                                                    ? 'bg-[#111844] text-white shadow-md'
                                                    : 'hover:bg-[#EAE0CF]'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="px-4 py-2.5 border border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EAE0CF] transition"
                                >
                                    Next
                                </button>

                                <span className="text-sm text-gray-500 ml-2">
                                    Page {page} of {pagination.totalPages}
                                </span>
                            </div>
                        )}
                    </div>
                </section>


            </main>
            <Footer />
        </>
    );
}