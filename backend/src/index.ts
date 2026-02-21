import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes (will be created next)
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import addressRoutes from './routes/address.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

// Import error handler
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5002;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://cart-managment-system-2u4hu09uw-ankits-projects-8d5f6fec.vercel.app',
        'https://cart-managment-system.vercel.app'
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0' as any, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Network Access: http://10.158.43.102:${PORT}`);
});

export default app;
