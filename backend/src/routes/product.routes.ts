import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes (for now, unprotected - can add admin auth later)
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
