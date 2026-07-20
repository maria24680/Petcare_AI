import { apiClient } from './client';

export const endpoints = {
    // Auth
    auth: {
        register: (data: any) => apiClient.post('/users/register', data),
        login: (data: any) => apiClient.post('/users/login', data),
        getProfile: (id: string) => apiClient.get(`/users/profile/${id}`),
        updateProfile: (id: string, data: any) => apiClient.put(`/users/profile/${id}`, data),
    },

    // Pets
    pets: {
        getAll: (params?: any) => apiClient.get('/pets', { params }),
        getById: (id: string) => apiClient.get(`/pets/${id}`),
        getUserPets: (userId: string) => apiClient.get(`/pets/user/${userId}`),
        create: (data: any) => apiClient.post('/pets', data),
        update: (id: string, data: any) => apiClient.put(`/pets/${id}`, data),
        delete: (id: string) => apiClient.delete(`/pets/${id}`),
    },

    // Vendors
    vendors: {
        register: (data: any) => apiClient.post('/vendors/register', data),
        getAll: () => apiClient.get('/vendors'),
        getById: (id: string) => apiClient.get(`/vendors/${id}`),
        addPet: (vendorId: string, data: any) => apiClient.post(`/vendors/${vendorId}/pets`, data),
        getPets: (vendorId: string) => apiClient.get(`/vendors/${vendorId}/pets`),
    },

    // AI
    ai: {
        chat: (data: any) => apiClient.post('/ai/chat', data),
        foodRecommendation: (data: any) => apiClient.post('/ai/food-recommendation', data),
        getChatHistory: (params?: any) => apiClient.get('/ai/chat-history', { params }),
        regenerate: (data: any) => apiClient.post('/ai/regenerate', data),
    },
};