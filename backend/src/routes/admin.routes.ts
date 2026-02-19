import { Router } from 'express';
import {
    getDashboardStats,
    updateStock,
    registerFace,
    checkFaceStatus,
    getCategoryReport,
    updateOrderStatus
} from '../controllers/admin.controller';

const router = Router();

// Dashboard & Reports
router.get('/dashboard', getDashboardStats);
router.get('/reports', getCategoryReport);

// Inventory
router.post('/stock', updateStock);

// Face Auth
router.post('/face/register', registerFace);
router.get('/face/:userId', checkFaceStatus);

// Orders
// Using POST instead of PATCH for better compatibility
router.post('/orders/:orderId/status', updateOrderStatus);

export default router;
