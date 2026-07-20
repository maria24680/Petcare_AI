'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Pet } from '@/types';

export function usePets(userId?: string) {
    const queryClient = useQueryClient();

    const useUserPets = () => {
        return useQuery({
            queryKey: ['pets', 'user', userId],
            queryFn: async () => {
                if (!userId) return [];
                const response = await apiClient.get(`/pets/user/${userId}`);
                return response.data.data;
            },
            enabled: !!userId,
        });
    };

    const usePet = (id: string) => {
        return useQuery({
            queryKey: ['pets', id],
            queryFn: async () => {
                const response = await apiClient.get(`/pets/${id}`);
                return response.data.data;
            },
            enabled: !!id,
        });
    };

    const createPet = useMutation({
        mutationFn: async (data: Omit<Pet, '_id' | 'createdAt' | 'updatedAt'>) => {
            const response = await apiClient.post('/pets', data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    const updatePet = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Pet> }) => {
            const response = await apiClient.put(`/pets/${id}`, data);
            return response.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    const deletePet = useMutation({
        mutationFn: async (id: string) => {
            await apiClient.delete(`/pets/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pets'] });
        },
    });

    return {
        useUserPets,
        usePet,
        createPet,
        updatePet,
        deletePet,
    };
}