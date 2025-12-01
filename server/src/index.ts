import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db/client';
import walletRoutes from './routes/wallet';
import authRoutes from './routes/auth';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/wallets', walletRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database and create default admin
async function initializeDatabase() {
    try {
        // Check if admin exists
        const adminExists = await prisma.admin.findUnique({
            where: { email: process.env.ADMIN_EMAIL || 'admin@company.com' },
        });

        if (!adminExists) {
            const passwordHash = await bcrypt.hash(
                process.env.ADMIN_PASSWORD || 'admin123',
                10
            );

            await prisma.admin.create({
                data: {
                    email: process.env.ADMIN_EMAIL || 'admin@company.com',
                    passwordHash,
                    role: 'admin',
                },
            });

            console.log('✅ Default admin created');
            console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@company.com'}`);
            console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
            console.log('   ⚠️  Change the password immediately!');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Start server
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
