import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/client';
import { generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /api/auth/admin/login
 * Admin login
 */
router.post('/admin/login', async (req, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const admin = await prisma.admin.findUnique({ where: { email } });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, admin.passwordHash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({
            email: admin.email,
            role: admin.role,
        });

        res.json({
            token,
            admin: {
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error: any) {
        console.error('Error during admin login:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

/**
 * POST /api/auth/employee/login
 * Employee login (simplified - just get wallet info)
 */
router.post('/employee/login', async (req, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }

        const employee = await prisma.employee.findUnique({ where: { email } });

        if (!employee) {
            return res.status(404).json({ error: 'Employee wallet not found' });
        }

        const token = generateToken({
            email: employee.email,
            role: 'employee',
        });

        res.json({
            token,
            employee: {
                email: employee.email,
                walletAddress: employee.walletAddress,
            },
        });
    } catch (error: any) {
        console.error('Error during employee login:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

export default router;
