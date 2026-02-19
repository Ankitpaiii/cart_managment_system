import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId, page = '1', limit = '12', sortBy = 'createdAt', order = 'desc' } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const where = categoryId ? { categoryId: categoryId as string } : {};

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: {
                        select: { id: true, name: true, slug: true }
                    }
                },
                orderBy: { [sortBy as string]: order },
                skip,
                take: limitNum
            }),
            prisma.product.count({ where })
        ]);

        res.status(200).json({
            products,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Try searching by ID first, then by slug
        const product = await prisma.product.findFirst({
            where: {
                OR: [
                    { id: id },
                    { slug: id }
                ]
            },
            include: {
                category: true
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ product });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId, name, description, price, stock, imageUrl, slug } = req.body;

        if (!categoryId || !name || !price || !slug) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const product = await prisma.product.create({
            data: {
                categoryId,
                name,
                description,
                price,
                stock: stock || 0,
                imageUrl,
                slug
            },
            include: {
                category: true
            }
        });

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { categoryId, name, description, price, stock, imageUrl, slug } = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...(categoryId && { categoryId }),
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(price && { price }),
                ...(stock !== undefined && { stock }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(slug && { slug })
            },
            include: {
                category: true
            }
        });

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({ where: { id } });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
