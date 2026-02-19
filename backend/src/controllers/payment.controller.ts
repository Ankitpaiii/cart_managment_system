import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { orderId, amount, paymentMethod, transactionId } = req.body;

        if (!orderId || !amount || !paymentMethod) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify order exists and belongs to user
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.customerId !== req.user.customerId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // Verify amount matches order total
        if (Number(amount) !== Number(order.total)) {
            return res.status(400).json({ error: 'Payment amount does not match order total' });
        }

        const payment = await prisma.payment.create({
            data: {
                orderId,
                amount,
                paymentMethod,
                transactionId,
                status: 'COMPLETED' // In real app, this would be PENDING until confirmed
            }
        });

        // Update order status
        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PROCESSING' }
        });

        res.status(201).json({ message: 'Payment recorded successfully', payment });
    } catch (error) {
        next(error);
    }
};

export const getPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { orderId } = req.params;

        const payment = await prisma.payment.findUnique({
            where: { orderId },
            include: {
                order: {
                    select: {
                        id: true,
                        customerId: true,
                        total: true,
                        status: true
                    }
                }
            }
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Verify ownership
        if (payment.order.customerId !== req.user.customerId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.status(200).json({ payment });
    } catch (error) {
        next(error);
    }
};
