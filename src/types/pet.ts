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

export interface PetFilters {
    petType?: string;
    age?: number;
    search?: string;
    vendorId?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}