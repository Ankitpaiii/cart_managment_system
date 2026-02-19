import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { generateToken } from '../utils/jwt';

// Register new customer
export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if customer already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { email }
        });

        if (existingCustomer) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create customer
        const customer = await prisma.customer.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone: phone || null
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                createdAt: true
            }
        });

        // Generate token
        const token = generateToken({ customerId: customer.id, email: customer.email });

        res.status(201).json({
            message: 'Registration successful',
            customer,
            token
        });
    } catch (error) {
        next(error);
    }
};

// Login customer
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find customer
        const customer = await prisma.customer.findUnique({
            where: { email }
        });

        if (!customer) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, customer.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken({ customerId: customer.id, email: customer.email });

        res.status(200).json({
            message: 'Login successful',
            customer: {
                id: customer.id,
                email: customer.email,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

// Get customer profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const customer = await prisma.customer.findUnique({
            where: { id: req.user.customerId },
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
