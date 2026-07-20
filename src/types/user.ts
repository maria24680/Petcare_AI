// ============================================
// User Types
// ============================================

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

// ============================================
// Auth Types
// ============================================

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

// ============================================
// Auth Response
// ============================================

export interface AuthResponse {
    success: boolean;
    message?: string;
    data: User;
    token?: string;
}

// ============================================
// Session Types
// ============================================

export interface Session {
    user: User;
    token: string;
    expiresAt: Date;
}

// ============================================
// Profile Update Types
// ============================================

export interface UpdateProfileData {
    fullName?: string;
    phone?: string;
    address?: string;
    profileImage?: string;
}

export interface UpdateVendorData extends UpdateProfileData {
    vendorDetails?: {
        businessName?: string;
        businessType?: string;
        description?: string;
        services?: string[];
        website?: string;
        contactEmail?: string;
        contactPhone?: string;
        location?: {
            address?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        };
    };
}

// ============================================
// User Stats
// ============================================

export interface UserStats {
    totalPets: number;
    totalFavorites: number;
    totalChats: number;
    totalFoodRecommendations: number;
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
    totalUsers: number;
    totalPets: number;
    totalVendors: number;
    totalAdmins: number;
    pendingVendors: number;
    petTypeDistribution: { _id: string; count: number }[];
    recentUsers: User[];
    recentPets: any[];
    monthlyUsers: { _id: { year: number; month: number }; count: number }[];
    monthlyPets: { _id: { year: number; month: number }; count: number }[];
    roleDistribution: { _id: string; count: number }[];
}

// ============================================
// Vendor Details (Full)
// ============================================

export interface VendorDetails {
    businessName: string;
    businessType: 'Pet Store' | 'Pet Grooming' | 'Pet Boarding' | 'Pet Training' | 'Veterinary Clinic' | 'Other';
    businessLicense?: string;
    taxId?: string;
    website?: string;
    description: string;
    services: string[];
    operatingHours?: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    location?: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    contactEmail: string;
    contactPhone: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
    rating: number;
    totalReviews: number;
    isActive: boolean;
    verificationStatus: 'pending' | 'verified' | 'rejected';
}

// ============================================
// Vendor Stats
// ============================================

export interface VendorStats {
    totalPets: number;
    totalProducts: number;
    totalServices: number;
    averageRating: number;
    totalReviews: number;
    recentReviews: any[];
}