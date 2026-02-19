import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Ensure user can only access their own data
        if (req.user?.customerId !== id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const customer = await prisma.customer.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(200).json({ customer });
    } catch (error) {
        next(error);
    }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, phone } = req.body;

        // Ensure user can only update their own data
        if (req.user?.customerId !== id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const customer = await prisma.customer.update({
            where: { id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(phone !== undefined && { phone })
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                updatedAt: true
            }
        });

        res.status(200).json({ message: 'Customer updated successfully', customer });
    } catch (error) {
        next(error);
    }
};
