import { TuyaContext } from '@tuya/tuya-connector-nodejs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('--- START TEST ---');
console.log('Access ID Len:', process.env.TUYA_ACCESS_ID ? process.env.TUYA_ACCESS_ID.length : 'MISSING');
console.log('Access Secret Len:', process.env.TUYA_ACCESS_SECRET ? process.env.TUYA_ACCESS_SECRET.length : 'MISSING');
console.log('Endpoint:', process.env.TUYA_API_ENDPOINT);

const context = new TuyaContext({
    baseUrl: process.env.TUYA_API_ENDPOINT || 'https://openapi.tuyus.com',
    accessKey: process.env.TUYA_ACCESS_ID || '',
    secretKey: process.env.TUYA_ACCESS_SECRET || '',
});

async function test() {
    try {
        console.log('Fetching devices...');
        const res = await context.request({
            path: '/v1.0/iot-03/devices',
            method: 'GET',
        });

        console.log('SUCCESS:', res.success);
        console.log('CODE:', res.code);
        console.log('MSG:', res.msg);
        if (res.result) {
            console.log('RESULT TYPE:', typeof res.result);
            console.log('RESULT:', JSON.stringify(res.result));
        } else {
            console.log('RESULT IS NULL');
        }
    } catch (error) {
        console.error('SCRIPT ERROR:', error);
    }
}

test();
