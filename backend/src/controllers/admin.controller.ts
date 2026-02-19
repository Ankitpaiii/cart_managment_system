import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { category: true }
        });
        const orders = await prisma.order.findMany({
            include: {
                customer: true,
                orderItems: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        const totalSales = orders.reduce((acc, order) => acc + Number(order.total), 0);

        res.json({ products, orders, totalSales });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateStock = async (req: Request, res: Response) => {
    const { productId, amount } = req.body;
    try {
        // Direct SQL command to update stock
        const result = await prisma.$executeRawUnsafe(
            `UPDATE products SET stock = stock + $1 WHERE id = $2`,
            Number(amount),
            productId
        );
        res.json({ message: 'Stock updated successfully', result });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const registerFace = async (req: Request, res: Response) => {
    const { userId, faceData } = req.body;
    try {
        const user = await prisma.customer.update({
            where: { id: userId },
            data: { faceData }
        });
        res.json({ message: 'Face registered successfully', user });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const checkFaceStatus = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await prisma.customer.findUnique({
            where: { id: userId as string },
            select: { faceData: true }
        });
        res.json({ hasFaceData: !!user?.faceData });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getCategoryReport = async (req: Request, res: Response) => {
    try {
        // Execute the stored procedure that uses a CURSOR
        const report: any = await prisma.$queryRawUnsafe(`SELECT * FROM get_categories_report()`);
        res.json(report);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id: orderId as string },
            data: { status }
        });
        res.json({ message: 'Order status updated successfully', order });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
