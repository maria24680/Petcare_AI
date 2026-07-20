'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { ArrowLeft, Upload, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function VendorAddPetPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        petName: '',
        petType: 'Dog',
        breed: '',
        age: '',
        weight: '',
        imageUrl: '',
        description: '',
        price: '',
        healthStatus: 'Good',
        isAvailable: true,
    });

    const petTypes = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Other'];
    const healthStatuses = ['Excellent', 'Good', 'Fair', 'Poor'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = {
                ...formData,
                age: parseInt(formData.age),
                weight: parseFloat(formData.weight),
                price: parseFloat(formData.price),
                vendorId: user?._id,
            };
            await apiClient.post(`/vendors/${user?._id}/pets`, data);
            router.push('/dashboard/vendor/pets');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to list pet');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/dashboard/vendor/pets"
                    className="text-gray-500 hover:text-[#111844] transition"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-[#111844]">List a Pet for Sale</h1>
                    <p className="text-gray-600 mt-1">Add a new pet to your inventory</p>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 card-shadow max-w-2xl">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#111844] mb-1">
                            Pet Name *
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                            placeholder="Max"
                            value={formData.petName}
                            onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111844] mb-1">
                            Pet Type *
                        </label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                            value={formData.petType}
                            onChange={(e) => setFormData({ ...formData, petType: e.target.value })}
                        >
                            {petTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111844] mb-1">
                            Breed *
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                            placeholder="Golden Retriever"
                            value={formData.breed}
                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Age (years) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="50"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                placeholder="2"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#111844] mb-1">
                                Weight (kg) *
                            </label>
                            <input
                                type="number"
                                required
                                min="0.1"
                                max="200"
                                step="0.1"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                placeholder="15.5"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111844] mb-1">
                            Price ($) *
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                placeholder="49.99"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111844] mb-1">
                            Health Status
                        </label>
                        <select
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                            value={formData.healthStatus}
                            onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                        >
                            {healthStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111844] mb-1">
                            Image URL (Optional)
                        </label>
                        <div className="relative">
                            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="url"
                                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                                placeholder="https://images.unsplash.com/photo-..."
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#111844] mb-1">
                            Description *
                        </label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                            placeholder="Describe your pet..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                            className="w-4 h-4 text-[#4B5694] rounded focus:ring-[#4B5694]"
                        />
                        <label htmlFor="isAvailable" className="text-sm text-gray-700">
                            Available for sale
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#111844] text-white py-3 rounded-lg font-semibold hover:bg-[#4B5694] transition disabled:opacity-50"
                    >
                        {loading ? 'Listing Pet...' : 'List Pet for Sale'}
                    </button>
                </form>
            </div>
        </div>
    );
}