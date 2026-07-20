// ============================================
// Pet Types
// ============================================

export interface Pet {
    _id?: string;
    userId?: string;
    vendorId?: string;
    petName: string;
    petType: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Rabbit' | 'Hamster' | 'Other';
    breed: string;
    age: number;
    weight: number;
    imageUrl?: string;
    description: string;
    isPublic: boolean;
    price?: number;
    isAvailable?: boolean;
    healthStatus?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    vaccinationStatus?: {
        isVaccinated: boolean;
        lastVaccinationDate?: Date;
        nextVaccinationDue?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

// ============================================
// Pet Filters
// ============================================

export interface PetFilters {
    petType?: string;
    age?: number;
    ageRange?: string;
    search?: string;
    vendorId?: string;
    minPrice?: number;
    maxPrice?: number;
    isPublic?: boolean;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// ============================================
// Pet Create/Update
// ============================================

export interface CreatePetData {
    petName: string;
    petType: string;
    breed: string;
    age: number;
    weight: number;
    imageUrl?: string;
    description: string;
    isPublic: boolean;
    price?: number;
    healthStatus?: string;
    isAvailable?: boolean;
    userId?: string;
    vendorId?: string;
}

export interface UpdatePetData extends Partial<CreatePetData> {
    _id: string;
}

// ============================================
// Pet Stats
// ============================================

export interface PetStats {
    totalPets: number;
    byType: { _id: string; count: number }[];
    byAge: { _id: string; count: number }[];
    byHealth: { _id: string; count: number }[];
    recentPets: Pet[];
    monthlyAddition: { month: string; count: number }[];
}

// ============================================
// Pet Card Props
// ============================================

export interface PetCardProps {
    pet: Pet;
    showActions?: boolean;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onFavorite?: (id: string) => void;
    isFavorite?: boolean;
    variant?: 'grid' | 'list';
    className?: string;
}

// ============================================
// Pet Detail Page Props
// ============================================

export interface PetDetailPageProps {
    pet: Pet;
    relatedPets?: Pet[];
    onContact?: () => void;
    onFavorite?: () => void;
    isFavorite?: boolean;
}

// ============================================
// Pet Form Props
// ============================================

export interface PetFormProps {
    initialData?: Partial<Pet>;
    onSubmit: (data: CreatePetData) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
    isVendor?: boolean;
}