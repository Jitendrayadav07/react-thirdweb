import { createThirdwebClient } from 'thirdweb';

const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

if (!THIRDWEB_SECRET_KEY) {
    throw new Error('THIRDWEB_SECRET_KEY is required');
}

export const thirdwebClient = createThirdwebClient({
    secretKey: THIRDWEB_SECRET_KEY,
});
