import { Router } from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes (for now, unprotected - can add admin auth later)
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
