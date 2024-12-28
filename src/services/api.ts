import axios from 'axios';
import { authApi } from './auth';

export const API_URL = 'https://emlak-portal-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use(
    (config) => {
        const token = authApi.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - 401 hatalarında logout yap
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authApi.logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const propertyApi = {
    // Tüm arsaları getir
    getAllProperties: () => api.get('/properties'),

    // Tek bir arsa getir
    getProperty: (id: string) => api.get(`/properties/${id}`),

    // Yeni arsa ekle
    createProperty: async (formData: FormData) => {
        try {
            const response = await api.post('/properties', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error: any) {
            console.error('API Error:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    },

    // Arsa güncelle
    updateProperty: (id: string, formData: FormData) => api.put(`/properties/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

    // Arsa sil
    deleteProperty: (id: string) => api.delete(`/properties/${id}`),

    // Dashboard istatistiklerini getir
    getDashboardStats: () => api.get('/properties/dashboard/stats')
}; 