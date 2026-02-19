import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const addresses = await prisma.address.findMany({
            where: { customerId: req.user.customerId },
            orderBy: { isDefault: 'desc' }
        });

        res.status(200).json({ addresses });
    } catch (error) {
        next(error);
    }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { street, city, state, zipCode, country, isDefault } = req.body;

        if (!street || !city || !state || !zipCode || !country) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { customerId: req.user.customerId, isDefault: true },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.create({
            data: {
                customerId: req.user.customerId,
                street,
                city,
                state,
                zipCode,
                country,
                isDefault: isDefault || false
            }
        });

        res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
        next(error);
    }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;
        const { street, city, state, zipCode, country, isDefault } = req.body;

        // Verify ownership
        const existingAddress = await prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.customerId !== req.user.customerId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { customerId: req.user.customerId, isDefault: true },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.update({
            where: { id },
            data: {
                ...(street && { street }),
                ...(city && { city }),
                ...(state && { state }),
                ...(zipCode && { zipCode }),
                ...(country && { country }),
                ...(isDefault !== undefined && { isDefault })
            }
        });

        res.status(200).json({ message: 'Address updated successfully', address });
    } catch (error) {
        next(error);
    }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { id } = req.params;

        // Verify ownership
        const existingAddress = await prisma.address.findUnique({ where: { id } });
        if (!existingAddress || existingAddress.customerId !== req.user.customerId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await prisma.address.delete({ where: { id } });

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        next(error);
    }
};
