const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Clean keys
const ACCESS_ID = (process.env.TUYA_ACCESS_ID || '').trim();
const ACCESS_SECRET = (process.env.TUYA_ACCESS_SECRET || '').trim();
const ENDPOINT = (process.env.TUYA_API_ENDPOINT || 'https://openapi.tuyaeu.com').trim();
const UID = (process.env.TUYA_UID || '').trim();

console.log('--- TEST: List Devices by UID ---');
console.log('UID:', UID);

const context = new TuyaContext({
    baseUrl: ENDPOINT,
    accessKey: ACCESS_ID,
    secretKey: ACCESS_SECRET,
});

async function test() {
    try {
        const path = `/v1.0/users/${UID}/devices`;
        console.log(`Requesting: ${path}`);

        const res = await context.request({
            path: path,
            method: 'GET',
        });

        console.log('Success:', res.success);
        if (res.result) {
            console.log('Result Type:', Array.isArray(res.result) ? 'Array' : typeof res.result);
            console.log('Result:', JSON.stringify(res.result));
        } else {
            console.log('Msg:', res.msg);
            console.log('Code:', res.code);
        }
    } catch (error) {
        console.error('SCRIPT ERROR:', error);
    }
}

test();
