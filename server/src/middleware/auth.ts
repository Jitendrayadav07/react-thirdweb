import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthRequest extends Request {
    user?: {
        email: string;
        role: string;
    };
}

export interface JWTPayload {
    email: string;
    role: string;
}

/**
 * Middleware to verify JWT token
 */
export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

/**
 * Middleware to check if user is admin
 */
export function requireAdmin(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}
