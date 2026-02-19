import { apiClient } from './client';

// Auth API
export const authApi = {
    register: async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    login: async (data: { email: string; password: string }) => {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/profile');
        return response.data;
    },
};

// Products API
export const productsApi = {
    getAll: async (params?: {
        categoryId?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        order?: 'asc' | 'desc';
    }) => {
        const response = await apiClient.get('/products', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },
};

// Categories API
export const categoriesApi = {
    getAll: async () => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },
};

// Orders API
export const ordersApi = {
    getAll: async () => {
        const response = await apiClient.get('/orders');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },

    create: async (data: { items: { productId: string; quantity: number }[] }) => {
        const response = await apiClient.post('/orders', data);
        return response.data;
    },
};

// Payments API
export const paymentsApi = {
    create: async (data: {
        orderId: string;
        amount: number;
        paymentMethod: string;
        transactionId?: string;
    }) => {
        const response = await apiClient.post('/payments', data);
        return response.data;
    },

    getByOrderId: async (orderId: string) => {
        const response = await apiClient.get(`/payments/${orderId}`);
        return response.data;
    },
};

// Addresses API
export const addressesApi = {
    getAll: async () => {
        const response = await apiClient.get('/addresses');
        return response.data;
    },

    create: async (data: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        isDefault?: boolean;
    }) => {
        const response = await apiClient.post('/addresses', data);
        return response.data;
    },

    update: async (id: string, data: Partial<{
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        isDefault: boolean;
    }>) => {
        const response = await apiClient.put(`/addresses/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(`/addresses/${id}`);
        return response.data;
    },
};
