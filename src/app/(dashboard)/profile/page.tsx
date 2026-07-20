'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ProfilePage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        profileImage: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phone: user.phone || '',
                address: user.address || '',
                profileImage: user.profileImage || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');

        try {
            await apiClient.put(`/users/profile/${user?._id}`, formData);
            // Update local storage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const updatedUser = { ...JSON.parse(storedUser), ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            setSuccess('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#111844]">Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal information</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl p-6 card-shadow text-center">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-full bg-[#4B5694]/10 flex items-center justify-center mx-auto overflow-hidden">
                                {formData.profileImage ? (
                                    <img
                                        src={formData.profileImage}
                                        alt={user?.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold text-[#4B5694]">
                                        {user?.fullName?.charAt(0) || 'U'}
                                    </span>
                                )}
                            </div>
                            <button className="absolute bottom-0 right-0 bg-[#111844] text-white p-2 rounded-full hover:bg-[#4B5694] transition">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="mt-4 text-xl font-semibold text-[#111844]">
                            {user?.fullName}
                        </h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <div className="mt-4 inline-block">
                            <span className={`inline-block text-xs px-3 py-1 rounded-full ${user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                                    user?.role === 'vendor' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                }`}>
                                {user?.role || 'User'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl p-6 card-shadow">
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Full Name"
                                icon={<User className="w-4 h-4" />}
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />

                            <Input
                                label="Phone"
                                icon={<Phone className="w-4 h-4" />}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />

                            <Input
                                label="Address"
                                icon={<MapPin className="w-4 h-4" />}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />

                            <Input
                                label="Profile Image URL"
                                icon={<Camera className="w-4 h-4" />}
                                value={formData.profileImage}
                                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />

                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full"
                                icon={<Save className="w-4 h-4" />}
                            >
                                Save Changes
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}