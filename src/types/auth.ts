export interface User {
    _id: string;
    email: string;
    username: string;
    fullName: string;
    role: 'user' | 'admin' | 'vendor';
    profileImage?: string;
    phone?: string;
    address?: string;
    vendorDetails?: any;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    username: string;
    fullName: string;
    password: string;
    phone?: string;
    address?: string;
}

export interface VendorRegisterData extends RegisterData {
    businessName: string;
    businessType: string;
    businessLicense?: string;
    taxId?: string;
    website?: string;
    description: string;
    services: string[];
    contactEmail: string;
    contactPhone: string;
}