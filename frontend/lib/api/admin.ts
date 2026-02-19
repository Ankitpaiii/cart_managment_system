import { apiClient } from './client';

export const adminService = {
    getDashboard: async () => {
        const response = await apiClient.get('/admin/dashboard');
        return response.data;
    },
    updateStock: async (productId: string, amount: number) => {
        const response = await apiClient.post('/admin/stock', { productId, amount });
        return response.data;
    },
    checkFaceStatus: async (userId: string) => {
        const response = await apiClient.get(`/admin/face/${userId}`);
        return response.data;
    },
    registerFace: async (userId: string, faceData: string) => {
        const response = await apiClient.post('/admin/face/register', { userId, faceData });
        return response.data;
    },
    getCategoryReport: async () => {
        const response = await apiClient.get('/admin/reports');
        return response.data;
    },
    updateOrderStatus: async (orderId: string, status: string) => {
        const response = await apiClient.post(`/admin/orders/${orderId}/status`, { status });
        return response.data;
    }
};
