import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const orders = await prisma.order.findMany({
            where: { customerId: req.user.customerId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, imageUrl: true }
                        }
                    }
                },
                payment: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                payment: true
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Verify ownership
        if (order.customerId !== req.user.customerId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.status(200).json({ order });
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { items } = req.body; // items: [{ productId, quantity }]

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain at least one item' });
        }

        // Fetch products to calculate total
        const productIds = items.map((item: any) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({ error: 'One or more products not found' });
        }

        // Calculate total
        let total = 0;
        const orderItemsData = items.map((item: any) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) throw new Error('Product not found');

            const itemTotal = Number(product.price) * item.quantity;
            total += itemTotal;

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            };
        });

        // Create order with order items
        const order = await prisma.order.create({
            data: {
                customerId: req.user.customerId,
                total,
                status: 'PENDING',
                orderItems: {
                    create: orderItemsData
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        next(error);
    }
};
