const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Clean keys
const ACCESS_ID = (process.env.TUYA_ACCESS_ID || '').trim();
const ACCESS_SECRET = (process.env.TUYA_ACCESS_SECRET || '').trim();
const ENDPOINT = (process.env.TUYA_API_ENDPOINT || 'https://openapi.tuyaeu.com').trim();

console.log('--- START TEST ---');
console.log('Access ID:', ACCESS_ID ? 'SET (Length: ' + ACCESS_ID.length + ')' : 'MISSING');
console.log('Endpoint:', ENDPOINT);

const context = new TuyaContext({
    baseUrl: ENDPOINT,
    accessKey: ACCESS_ID,
    secretKey: ACCESS_SECRET,
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
            console.log('RESULT:', JSON.stringify(res.result));
        } else {
            console.log('RESULT IS NULL');
        }
    } catch (error) {
        console.error('SCRIPT ERROR:', error);
    }
}

test();
