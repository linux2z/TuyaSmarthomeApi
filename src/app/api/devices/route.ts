import { NextResponse } from 'next/server';
import context from '@/lib/tuya';

// Helper to retry requests on network errors
async function requestWithRetry(config: any, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await context.request(config);
            return res;
        } catch (error: any) {
            // Retry on network errors
            const isRetryable = error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.message?.includes('socket hang up');

            if (isRetryable && i < retries - 1) {
                console.warn(`Tuya API Error (${error.code}). Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
                await new Promise(r => setTimeout(r, delay));
                continue;
            }
            throw error;
        }
    }
}

export async function GET() {
    try {
        const uid = (process.env.TUYA_UID || '').trim();
        if (!uid) {
            throw new Error('TUYA_UID is missing in environment variables');
        }

        // Use retry wrapper
        const res = await requestWithRetry({
            path: `/v1.0/users/${uid}/devices`,
            method: 'GET',
        });

        if (!res.success) {
            console.error('Tuya API Error:', res);
            return NextResponse.json({ error: res.msg, code: res.code }, { status: 500 });
        }

        return NextResponse.json(res);
    } catch (error: any) {
        console.error('Tuya Request Failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
