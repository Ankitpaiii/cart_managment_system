import { Router } from 'express';
import { getCustomer, updateCustomer } from '../controllers/customer.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All customer routes require authentication
router.use(authenticate);

router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);

export default router;
