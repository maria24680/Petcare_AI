// ============================================
// Vendor Types
// ============================================

import { User, VendorDetails } from './user';
import { Pet } from './pet';

export interface Vendor extends User {
    role: 'vendor';
    vendorDetails: VendorDetails;
}

// ============================================
// Vendor Registration Data
// ============================================

export interface VendorRegistrationData {
    email: string;
    username: string;
    fullName: string;
    password: string;
    phone?: string;
    address?: string;
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
// Vendor Dashboard Stats
// ============================================

export interface VendorDashboardStats {
    totalPets: number;
    totalProducts: number;
    totalServices: number;
    totalReviews: number;
    averageRating: number;
    petsByType: { _id: string; count: number }[];
    recentPets: Pet[];
    monthlyStats: {
        month: string;
        pets: number;
        revenue: number;
    }[];
    recentReviews: Review[];
}

// ============================================
// Vendor Product
// ============================================

export interface VendorProduct {
    _id: string;
    vendorId: string;
    name: string;
    category: 'Food' | 'Toys' | 'Accessories' | 'Grooming' | 'Medicine' | 'Other';
    description: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    imageUrl: string;
    petType: string[];
    brand: string;
    rating: number;
    totalReviews: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Vendor Product Create/Update
// ============================================

export interface CreateVendorProductData {
    name: string;
    category: string;
    description: string;
    price: number;
    discountPrice?: number;
    stockQuantity: number;
    imageUrl: string;
    petType: string[];
    brand: string;
    isAvailable?: boolean;
}

export interface UpdateVendorProductData extends Partial<CreateVendorProductData> {
    _id: string;
}

// ============================================
// Vendor Service
// ============================================

export interface VendorService {
    _id: string;
    vendorId: string;
    name: string;
    category: 'Grooming' | 'Training' | 'Boarding' | 'Daycare' | 'Walking' | 'Veterinary' | 'Other';
    description: string;
    price: number;
    duration: string;
    images: string[];
    includes: string[];
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Vendor Service Create/Update
// ============================================

export interface CreateVendorServiceData {
    name: string;
    category: string;
    description: string;
    price: number;
    duration: string;
    images?: string[];
    includes?: string[];
    isAvailable?: boolean;
}

export interface UpdateVendorServiceData extends Partial<CreateVendorServiceData> {
    _id: string;
}

// ============================================
// Appointment
// ============================================

export interface Appointment {
    _id: string;
    vendorId: string;
    userId: string;
    serviceId: string;
    petId: string;
    date: Date;
    time: string;
    duration: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Appointment Create
// ============================================

export interface CreateAppointmentData {
    vendorId: string;
    serviceId: string;
    petId: string;
    date: string;
    time: string;
    notes?: string;
}

// ============================================
// Review
// ============================================

export interface Review {
    _id: string;
    vendorId: string;
    userId: string;
    petId?: string;
    rating: number;
    comment: string;
    images?: string[];
    isVerifiedPurchase: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Review Create
// ============================================

export interface CreateReviewData {
    vendorId: string;
    rating: number;
    comment: string;
    images?: string[];
    petId?: string;
}

// ============================================
// Vendor Filter Params
// ============================================

export interface VendorFilterParams {
    search?: string;
    businessType?: string;
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    isActive?: boolean;
    minRating?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ============================================
// Vendor Analytics
// ============================================

export interface VendorAnalytics {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    topProducts: {
        productId: string;
        name: string;
        sales: number;
        revenue: number;
    }[];
    salesByMonth: {
        month: string;
        revenue: number;
        orders: number;
    }[];
    customerSatisfaction: {
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { rating: number; count: number }[];
    };
}

// ============================================
// Vendor Settings
// ============================================

export interface VendorSettings {
    notifications: {
        newOrder: boolean;
        newReview: boolean;
        appointmentReminder: boolean;
        marketingEmails: boolean;
    };
    workingHours: {
        monday: { open: string; close: string; isClosed: boolean };
        tuesday: { open: string; close: string; isClosed: boolean };
        wednesday: { open: string; close: string; isClosed: boolean };
        thursday: { open: string; close: string; isClosed: boolean };
        friday: { open: string; close: string; isClosed: boolean };
        saturday: { open: string; close: string; isClosed: boolean };
        sunday: { open: string; close: string; isClosed: boolean };
    };
    shipping: {
        available: boolean;
        cost: number;
        freeShippingThreshold?: number;
    };
}

// ============================================
// Vendor Payout
// ============================================

export interface VendorPayout {
    _id: string;
    vendorId: string;
    amount: number;
    status: 'pending' | 'processed' | 'failed' | 'completed';
    method: 'bank' | 'paypal' | 'stripe';
    accountDetails: {
        bankName?: string;
        accountNumber?: string;
        paypalEmail?: string;
        stripeAccountId?: string;
    };
    transactionId?: string;
    processedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}