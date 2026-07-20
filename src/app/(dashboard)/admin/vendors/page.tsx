'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Search, Store, CheckCircle, XCircle, Eye, Shield } from 'lucide-react';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function AdminVendorsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedVendor, setSelectedVendor] = useState<any>(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['adminVendors', search, statusFilter],
        queryFn: async () => {
            const params: any = {};
            if (search) params.search = search;
            if (statusFilter !== 'All') params.status = statusFilter;
            const response = await apiClient.get('/admin/vendors', { params });
            return response.data;
        },
    });

    const verifyVendor = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            await apiClient.put(`/admin/vendors/${id}/verify`, { status });
        },
        onSuccess: () => {
            refetch();
        },
    });

    const toggleVendor = useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            await apiClient.put(`/admin/vendors/${id}/toggle`, { isActive });
        },
        onSuccess: () => {
            refetch();
        },
    });

    const handleVerify = async (id: string, status: string) => {
        if (confirm(`Are you sure you want to ${status} this vendor?`)) {
            await verifyVendor.mutateAsync({ id, status });
        }
    };

    const handleToggle = async (id: string, isActive: boolean) => {
        await toggleVendor.mutateAsync({ id, isActive });
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            verified: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">Vendor Management</h1>
                <p className="text-gray-600 mt-1">Manage all vendors on the platform</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 card-shadow mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Search vendors..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694]"
                    >
                        <option value="All">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Vendors List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.data?.map((vendor: any) => (
                        <div key={vendor._id} className="bg-white rounded-xl overflow-hidden card-shadow hover:shadow-lg transition">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#4B5694]/10 rounded-full flex items-center justify-center">
                                            <Store className="w-6 h-6 text-[#4B5694]" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#111844]">
                                                {vendor.vendorDetails?.businessName || vendor.fullName}
                                            </h3>
                                            <p className="text-sm text-gray-500">{vendor.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(vendor.vendorDetails?.verificationStatus)}`}>
                                        {vendor.vendorDetails?.verificationStatus || 'pending'}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                    {vendor.vendorDetails?.description}
                                </p>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-gray-500">Type</p>
                                        <p className="font-medium">{vendor.vendorDetails?.businessType}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Pets</p>
                                        <p className="font-medium">{vendor.stats?.totalPets || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Rating</p>
                                        <p className="font-medium">{vendor.vendorDetails?.rating || 0} ★</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Reviews</p>
                                        <p className="font-medium">{vendor.vendorDetails?.totalReviews || 0}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedVendor(vendor)}
                                        className="bg-[#4B5694] text-white px-3 py-1.5 rounded-lg text-sm hover:bg-[#7288AE] transition flex items-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </button>
                                    {vendor.vendorDetails?.verificationStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleVerify(vendor._id, 'verified')}
                                                className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1"
                                            >
                                                <CheckCircle className="w-3 h-3" />
                                                Verify
                                            </button>
                                            <button
                                                onClick={() => handleVerify(vendor._id, 'rejected')}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition flex items-center gap-1"
                                            >
                                                <XCircle className="w-3 h-3" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleToggle(vendor._id, !vendor.vendorDetails?.isActive)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition flex items-center gap-1 ${vendor.vendorDetails?.isActive
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                    >
                                        {vendor.vendorDetails?.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Vendor Details Modal */}
            <Modal
                isOpen={!!selectedVendor}
                onClose={() => setSelectedVendor(null)}
                title={selectedVendor?.vendorDetails?.businessName || 'Vendor Details'}
                size="lg"
            >
                {selectedVendor && (
                    <div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-[#111844] mb-2">Business Information</h4>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500">Business Name</dt>
                                        <dd className="font-medium">{selectedVendor.vendorDetails?.businessName}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Business Type</dt>
                                        <dd className="font-medium">{selectedVendor.vendorDetails?.businessType}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Description</dt>
                                        <dd className="text-gray-600">{selectedVendor.vendorDetails?.description}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Status</dt>
                                        <dd>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedVendor.vendorDetails?.verificationStatus)}`}>
                                                {selectedVendor.vendorDetails?.verificationStatus || 'pending'}
                                            </span>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#111844] mb-2">Contact Information</h4>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm text-gray-500">Owner</dt>
                                        <dd className="font-medium">{selectedVendor.fullName}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Email</dt>
                                        <dd className="font-medium">{selectedVendor.vendorDetails?.contactEmail || selectedVendor.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Phone</dt>
                                        <dd className="font-medium">{selectedVendor.vendorDetails?.contactPhone || selectedVendor.phone}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-gray-500">Location</dt>
                                        <dd className="font-medium">
                                            {selectedVendor.vendorDetails?.location?.city || 'Not set'}
                                            {selectedVendor.vendorDetails?.location?.state && `, ${selectedVendor.vendorDetails.location.state}`}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}