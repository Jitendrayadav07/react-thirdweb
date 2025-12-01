import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
}

const KEY = Buffer.from(ENCRYPTION_KEY, 'utf-8');

export interface EncryptedData {
    encrypted: string;
    iv: string;
    authTag: string;
}

/**
 * Encrypt a private key using AES-256-GCM
 */
export function encryptPrivateKey(privateKey: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
    };
}

/**
 * Decrypt a private key using AES-256-GCM
 */
export function decryptPrivateKey(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        KEY,
        Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
