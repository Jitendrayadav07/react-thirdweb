import { Router, Response } from 'express';
import { generatePrivateKey, privateKeyToAccount } from 'thirdweb/wallets';
import { sepolia } from 'thirdweb/chains';
import { prisma } from '../db/client';
import { encryptPrivateKey, decryptPrivateKey } from '../config/encryption';
import { thirdwebClient } from '../config/thirdweb';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { createAuditLog } from '../utils/audit';

const router = Router();

/**
 * POST /api/wallets/create
 * Create a new wallet for an employee (Admin only)
 */
router.post('/create', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if wallet already exists
        const existing = await prisma.employee.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Wallet already exists for this employee' });
        }

        // Generate new private key
        const privateKey = generatePrivateKey();

        // Create account from private key
        const account = await privateKeyToAccount({
            client: thirdwebClient,
            privateKey,
        });

        const walletAddress = account.address;

        // Encrypt private key
        const encrypted = encryptPrivateKey(privateKey);

        // Store in database
        const employee = await prisma.employee.create({
            data: {
                email,
                walletAddress,
                encryptedPrivateKey: encrypted.encrypted,
                iv: encrypted.iv,
                authTag: encrypted.authTag,
            },
        });

        // Audit log
        await createAuditLog({
            action: 'WALLET_CREATED',
            employeeEmail: email,
            adminEmail: req.user!.email,
            ipAddress: req.ip,
        });

        res.json({
            success: true,
            employee: {
                email: employee.email,
                walletAddress: employee.walletAddress,
                createdAt: employee.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ error: 'Failed to create wallet', details: error.message });
    }
});

/**
 * GET /api/wallets/:email
 * Get wallet information for an employee
 */
router.get('/:email', authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.params;

        // Employees can only access their own wallet
        if (req.user!.role !== 'admin' && req.user!.email !== email) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const employee = await prisma.employee.findUnique({ where: { email } });

        if (!employee) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        // Update last used timestamp
        await prisma.employee.update({
            where: { email },
            data: { lastUsed: new Date() },
        });

        res.json({
            employee: {
                email: employee.email,
                walletAddress: employee.walletAddress,
                createdAt: employee.createdAt,
                lastUsed: employee.lastUsed,
            },
        });
    } catch (error: any) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({ error: 'Failed to fetch wallet', details: error.message });
    }
});

/**
 * GET /api/wallets
 * List all employee wallets (Admin only)
 */
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                email: true,
                walletAddress: true,
                createdAt: true,
                lastUsed: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ employees });
    } catch (error: any) {
        console.error('Error listing wallets:', error);
        res.status(500).json({ error: 'Failed to list wallets', details: error.message });
    }
});

/**
 * POST /api/wallets/export/:email
 * Export private key for an employee wallet (Admin only)
 */
router.post('/export/:email', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { email } = req.params;

        const employee = await prisma.employee.findUnique({ where: { email } });

        if (!employee) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        // Decrypt private key
        const privateKey = decryptPrivateKey({
            encrypted: employee.encryptedPrivateKey,
            iv: employee.iv,
            authTag: employee.authTag,
        });

        // Audit log - CRITICAL
        await createAuditLog({
            action: 'PRIVATE_KEY_EXPORTED',
            employeeEmail: email,
            adminEmail: req.user!.email,
            ipAddress: req.ip,
            details: `Private key exported by admin ${req.user!.email}`,
        });

        res.json({
            email: employee.email,
            walletAddress: employee.walletAddress,
            privateKey, // ⚠️ Handle with extreme care on frontend!
        });
    } catch (error: any) {
        console.error('Error exporting private key:', error);
        res.status(500).json({ error: 'Failed to export private key', details: error.message });
    }
});

export default router;
