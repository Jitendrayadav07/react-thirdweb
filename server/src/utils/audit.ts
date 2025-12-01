import { prisma } from '../db/client';

interface AuditLogData {
    action: string;
    employeeEmail?: string;
    adminEmail?: string;
    ipAddress?: string;
    details?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData) {
    try {
        await prisma.auditLog.create({
            data: {
                action: data.action,
                employeeEmail: data.employeeEmail,
                adminEmail: data.adminEmail,
                ipAddress: data.ipAddress,
                details: data.details,
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw - audit logging failure shouldn't break the main operation
    }
}

/**
 * Get audit logs (admin only)
 */
export async function getAuditLogs(limit: number = 100) {
    return prisma.auditLog.findMany({
        take: limit,
        orderBy: { timestamp: 'desc' },
    });
}
