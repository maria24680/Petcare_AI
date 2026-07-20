// ============================================
// Export all types from user
// ============================================

export type {
    User,
    LoginCredentials,
    RegisterData,
    VendorRegisterData,
    AuthResponse,
    Session,
    UpdateProfileData,
    UpdateVendorData,
    UserStats,
    DashboardStats,
    VendorDetails,
    VendorStats,
} from './user';

// ============================================
// Export all types from pet
// ============================================

export type {
    Pet,
    PetFilters,
    CreatePetData,
    UpdatePetData,
    PetStats,
    PetCardProps,
    PetDetailPageProps,
    PetFormProps,
} from './pet';

// ============================================
// Export all types from vendor
// ============================================

export type {
    Vendor,
    VendorRegistrationData,
    VendorDashboardStats,
    VendorProduct,
    CreateVendorProductData,
    UpdateVendorProductData,
    VendorService,
    CreateVendorServiceData,
    UpdateVendorServiceData,
    Appointment,
    CreateAppointmentData,
    Review,
    CreateReviewData,
    VendorFilterParams,
    VendorAnalytics,
    VendorSettings,
    VendorPayout,
} from './vendor';

// ============================================
// Common API Types
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
    error?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface FilterParams {
    search?: string;
    petType?: string;
    age?: number;
    ageRange?: string;
    minPrice?: number;
    maxPrice?: number;
    vendorId?: string;
    isPublic?: boolean;
    isAvailable?: boolean;
}

// ============================================
// Component Props Types
// ============================================

export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface LoadingState {
    isLoading: boolean;
    error?: string | null;
}

// ============================================
// Form Types
// ============================================

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'file';
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: string }[];
    validation?: (value: any) => string | undefined;
    accept?: string;
}

export interface FormState<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    isSubmitting: boolean;
    isValid: boolean;
    touched: Partial<Record<keyof T, boolean>>;
}

// ============================================
// Chart Types
// ============================================

export interface ChartData {
    name: string;
    value: number;
    [key: string]: any;
}

export interface ChartConfig {
    data: ChartData[];
    colors?: string[];
    xAxisKey?: string;
    dataKey?: string;
    height?: number;
    width?: number;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    title?: string;
    duration?: number;
    read: boolean;
    createdAt: Date;
    link?: string;
}

// ============================================
// Upload Types
// ============================================

export interface UploadFile {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    progress: number;
    status: 'uploading' | 'completed' | 'error' | 'idle';
    error?: string;
}

// ============================================
// Filter Types
// ============================================

export interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

export interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
    selected?: string[];
    multiple?: boolean;
}

// ============================================
// Sort Types
// ============================================

export interface SortOption {
    label: string;
    value: string;
    field: string;
    direction: 'asc' | 'desc';
}

// ============================================
// Theme Types
// ============================================

export interface ThemeColors {
    primary: string;
    primaryLight: string;
    primaryLighter: string;
    secondary: string;
    background: string;
    text: string;
    error: string;
    success: string;
    warning: string;
    info: string;
}

// ============================================
// Route Types
// ============================================

export interface Route {
    path: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    children?: Route[];
    requiresAuth?: boolean;
    roles?: ('user' | 'admin' | 'vendor')[];
}

// ============================================
// Breadcrumb Types
// ============================================

export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
}