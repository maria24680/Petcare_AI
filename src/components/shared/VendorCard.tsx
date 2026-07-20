'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Store, Star, MapPin, Mail, Phone } from 'lucide-react';

interface VendorCardProps {
    vendor: {
        _id: string;
        fullName: string;
        email: string;
        vendorDetails: {
            businessName: string;
            businessType: string;
            description: string;
            rating: number;
            totalReviews: number;
            location: {
                address: string;
                city: string;
                state: string;
                zipCode: string;
            };
            contactEmail: string;
            contactPhone: string;
            isActive: boolean;
            verificationStatus: string;
        };
    };
}

const VendorCard = ({ vendor }: VendorCardProps) => {
    const { vendorDetails } = vendor;

    return (
        <Link href={`/vendors/${vendor._id}`}>
            <Card className="group hover:shadow-lg transition cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-[#4B5694]/10 rounded-full flex items-center justify-center">
                            <Store className="w-8 h-8 text-[#4B5694]" />
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold">
                                {vendorDetails?.rating || 0}
                            </span>
                            <span className="text-xs text-gray-400">
                                ({vendorDetails?.totalReviews || 0})
                            </span>
                        </div>
                    </div>

                    <h3 className="font-semibold text-[#111844] text-lg">
                        {vendorDetails?.businessName || vendor.fullName}
                    </h3>
                    <p className="text-sm text-[#4B5694] mb-2">
                        {vendorDetails?.businessType}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {vendorDetails?.description}
                    </p>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>
                                {vendorDetails?.location?.city || 'Location not set'}
                                {vendorDetails?.location?.state && `, ${vendorDetails.location.state}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-4 h-4" />
                            <span>{vendorDetails?.contactEmail || vendor.email}</span>
                        </div>
                        {vendorDetails?.contactPhone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Phone className="w-4 h-4" />
                                <span>{vendorDetails.contactPhone}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${vendorDetails?.verificationStatus === 'verified'
                                ? 'bg-green-100 text-green-700'
                                : vendorDetails?.verificationStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                            {vendorDetails?.verificationStatus || 'Pending'}
                        </span>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${vendorDetails?.isActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                            {vendorDetails?.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default VendorCard;