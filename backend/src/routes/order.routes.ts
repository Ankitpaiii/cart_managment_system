import { Router } from 'express';
import { getOrders, getOrder, createOrder } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);

export default router;
