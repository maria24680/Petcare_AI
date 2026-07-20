'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Store, Plus, X, Clock } from 'lucide-react';

interface Service {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    duration: string;
    images: string[];
    includes: string[];
    isAvailable: boolean;
}

// Must match the exact list allowed by vendorValidation.service on the backend
const CATEGORIES = ['Grooming', 'Training', 'Boarding', 'Daycare', 'Walking', 'Veterinary', 'Other'];

export default function VendorServicesPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [showAddModal, setShowAddModal] = useState(false);
    const [includesInput, setIncludesInput] = useState('');
    const [form, setForm] = useState({
        name: '',
        category: 'Grooming',
        description: '',
        price: '',
        duration: '',
        includes: [] as string[],
    });

    const { data: services, isLoading } = useQuery({
        queryKey: ['vendorServices', user?._id],
        queryFn: async () => {
            if (!user?._id) return [];
            const response = await apiClient.get(`/vendors/${user._id}/services?limit=100`);
            return response.data.data as Service[];
        },
        enabled: !!user?._id,
    });

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const addServiceMutation = useMutation({
        mutationFn: async () => {
            if (!user?._id) throw new Error('Not authenticated');
            return apiClient.post(`/vendors/${user._id}/services`, {
                ...form,
                price: Number(form.price),
            });
        },
        onError: (error: any) => {
            const backendErrors = error?.response?.data?.errors;
            if (Array.isArray(backendErrors)) {
                setValidationErrors(backendErrors.map((e: any) => e.msg));
            } else {
                setValidationErrors(['Failed to add service. Please try again.']);
            }
        },
        onSuccess: () => {
            setValidationErrors([]);
            queryClient.invalidateQueries({ queryKey: ['vendorServices', user?._id] });
            setShowAddModal(false);
            setForm({
                name: '',
                category: 'Grooming',
                description: '',
                price: '',
                duration: '',
                includes: [],
            });
            setIncludesInput('');
        },
    });

    const addInclude = () => {
        const trimmed = includesInput.trim();
        if (trimmed && !form.includes.includes(trimmed)) {
            setForm((prev) => ({ ...prev, includes: [...prev.includes, trimmed] }));
            setIncludesInput('');
        }
    };

    const removeInclude = (item: string) => {
        setForm((prev) => ({ ...prev, includes: prev.includes.filter((i) => i !== item) }));
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
                    <h1 className="text-3xl font-bold text-[#111844]">My Services</h1>
                    <p className="text-gray-600 mt-1">Manage your service offerings</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#111844] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4B5694] transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Service
                </button>
            </div>

            {!services || services.length === 0 ? (
                <div className="bg-white rounded-xl p-12 card-shadow text-center">
                    <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No services listed yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service._id} className="bg-white rounded-xl p-6 card-shadow">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-[#111844]">{service.name}</h3>
                                <span className="text-xs bg-[#EAE0CF] text-[#111844] px-2 py-0.5 rounded-full">
                                    {service.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                            {service.includes?.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                    {service.includes.map((item, i) => (
                                        <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-[#4B5694] rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-[#111844] font-bold">${service.price}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {service.duration}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-[#111844]">Add Service</h2>
                            <button onClick={() => setShowAddModal(false)}>
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <input
                                type="text"
                                placeholder="Service name"
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
                                    type="text"
                                    placeholder="Duration (e.g. 1 hour)"
                                    value={form.duration}
                                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">What&apos;s included</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. Bath, nail trim"
                                        value={includesInput}
                                        onChange={(e) => setIncludesInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addInclude();
                                            }
                                        }}
                                        className="flex-1 border rounded-lg px-3 py-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={addInclude}
                                        className="px-4 py-2 bg-[#EAE0CF] text-[#111844] rounded-lg"
                                    >
                                        Add
                                    </button>
                                </div>
                                {form.includes.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {form.includes.map((item) => (
                                            <span
                                                key={item}
                                                className="text-sm bg-[#4B5694]/10 text-[#4B5694] px-2 py-1 rounded-full flex items-center gap-1"
                                            >
                                                {item}
                                                <button onClick={() => removeInclude(item)}>
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
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
                                onClick={() => addServiceMutation.mutate()}
                                disabled={addServiceMutation.isPending}
                                className="w-full bg-[#111844] text-white py-2 rounded-lg hover:bg-[#4B5694] transition disabled:opacity-50"
                            >
                                {addServiceMutation.isPending ? 'Adding...' : 'Add Service'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}