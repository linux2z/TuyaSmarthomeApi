const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const context = new TuyaContext({
    baseUrl: process.env.TUYA_API_ENDPOINT,
    accessKey: process.env.TUYA_ACCESS_ID,
    secretKey: process.env.TUYA_ACCESS_SECRET,
});

async function test() {
    try {
        // Using the exact Device ID from the User's curl command
        const deviceId = 'bf7fe8lkrxlfaasx';
        console.log(`Testing with Device ID: ${deviceId}`);

        // Attempt 1: The exact call user showed (Get Device Details)
        // path: /v1.0/devices/{device_id}
        const res = await context.request({
            path: `/v1.0/devices/${deviceId}`,
            method: 'GET',
        });

        console.log('--- /v1.0/devices/:id Response ---');
        console.log('Success:', res.success);
        console.log('Code:', res.code);
        console.log('Msg:', res.msg);
        if (res.result) console.log('Result:', JSON.stringify(res.result));

        if (!res.success && res.code === 1104) {
            console.error('CRITICAL: Sign validate still illegal.');
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
}

test();
