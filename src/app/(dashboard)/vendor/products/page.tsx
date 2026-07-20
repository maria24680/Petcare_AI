'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Package, Plus, X, Trash2 } from 'lucide-react';

interface Product {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    imageUrl: string;
    petType: string[];
    brand: string;
    isAvailable: boolean;
}

const CATEGORIES = ['Food', 'Toys', 'Accessories', 'Grooming', 'Medicine'];
const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Other'];

export default function VendorProductsPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        category: 'Food',
        description: '',
        price: '',
        discountPrice: '',
        stockQuantity: '',
        imageUrl: '',
        petType: [] as string[],
        brand: '',
    });

    const { data: products, isLoading } = useQuery({
        queryKey: ['vendorProducts', user?._id],
        queryFn: async () => {
            if (!user?._id) return [];
            const response = await apiClient.get(`/vendors/${user._id}/products?limit=100`);
            return response.data.data as Product[];
        },
        enabled: !!user?._id,
    });

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const addProductMutation = useMutation({
        mutationFn: async () => {
            if (!user?._id) throw new Error('Not authenticated');
            return apiClient.post(`/vendors/${user._id}/products`, {
                ...form,
                price: Number(form.price),
                discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
                stockQuantity: Number(form.stockQuantity),
            });
        },
        onError: (error: any) => {
            // express-validator returns { success: false, errors: [{ msg, path, ... }] }
            const backendErrors = error?.response?.data?.errors;
            if (Array.isArray(backendErrors)) {
                setValidationErrors(backendErrors.map((e: any) => e.msg));
            } else {
                setValidationErrors(['Failed to add product. Please try again.']);
            }
        },
        onSuccess: () => {
            setValidationErrors([]);
            queryClient.invalidateQueries({ queryKey: ['vendorProducts', user?._id] });
            setShowAddModal(false);
            setForm({
                name: '',
                category: 'Food',
                description: '',
                price: '',
                discountPrice: '',
                stockQuantity: '',
                imageUrl: '',
                petType: [],
                brand: '',
            });
        },
    });

    const togglePetType = (type: string) => {
        setForm((prev) => ({
            ...prev,
            petType: prev.petType.includes(type)
                ? prev.petType.filter((t) => t !== type)
                : [...prev.petType, type],
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5694]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#111844]">My Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product listings</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#111844] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4B5694] transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {!products || products.length === 0 ? (
                <div className="bg-white rounded-xl p-12 card-shadow text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products listed yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl overflow-hidden card-shadow">
                            <div className="h-40 bg-gray-100">
                                {product.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-10 h-10 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-[#111844]">{product.name}</h3>
                                    <span className="text-xs bg-[#EAE0CF] text-[#111844] px-2 py-0.5 rounded-full">
                                        {product.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <div>
                                        {product.discountPrice ? (
                                            <>
                                                <span className="text-[#111844] font-bold">${product.discountPrice}</span>
                                                <span className="text-gray-400 text-sm line-through ml-2">${product.price}</span>
                                            </>
                                        ) : (
                                            <span className="text-[#111844] font-bold">${product.price}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">Stock: {product.stockQuantity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-[#111844]">Add Product</h2>
                            <button onClick={() => setShowAddModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <input
                                type="text"
                                placeholder="Product name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                                rows={3}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                                <input
                                    type="number"
                                    placeholder="Discount price (optional)"
                                    value={form.discountPrice}
                                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <input
                                type="number"
                                placeholder="Stock quantity"
                                value={form.stockQuantity}
                                onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                            <input
                                type="text"
                                placeholder="Brand *"
                                value={form.brand}
                                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                            <div>
                                <input
                                    type="text"
                                    placeholder="Image URL * (e.g. https://example.com/image.jpg)"
                                    value={form.imageUrl}
                                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Required — must be a full URL starting with http:// or https://
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">Pet types</p>
                                <div className="flex flex-wrap gap-2">
                                    {PET_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => togglePetType(type)}
                                            className={`px-3 py-1 rounded-full text-sm border ${form.petType.includes(type)
                                                    ? 'bg-[#111844] text-white border-[#111844]'
                                                    : 'text-gray-600 border-gray-300'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {validationErrors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <ul className="text-red-600 text-sm list-disc list-inside space-y-0.5">
                                        {validationErrors.map((msg, i) => (
                                            <li key={i}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <button
                                onClick={() => addProductMutation.mutate()}
                                disabled={addProductMutation.isPending}
                                className="w-full bg-[#111844] text-white py-2 rounded-lg hover:bg-[#4B5694] transition disabled:opacity-50"
                            >
                                {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}