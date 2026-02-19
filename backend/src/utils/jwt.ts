import jwt from 'jsonwebtoken';

export const generateToken = (payload: { customerId: string; email: string }): string => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};
