import { Router } from 'express';
import { createPayment, getPayment } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

router.post('/', createPayment);
router.get('/:orderId', getPayment);

export default router;
