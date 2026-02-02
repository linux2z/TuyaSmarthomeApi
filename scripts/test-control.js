const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Clean keys
const ACCESS_ID = (process.env.TUYA_ACCESS_ID || '').trim();
const ACCESS_SECRET = (process.env.TUYA_ACCESS_SECRET || '').trim();
const ENDPOINT = (process.env.TUYA_API_ENDPOINT || 'https://openapi.tuyaeu.com').trim();
const DEVICE_ID = 'bf7fe8lkrxlfaasx'; // Using the known device ID

console.log('--- TEST: Control Device ---');

const context = new TuyaContext({
    baseUrl: ENDPOINT,
    accessKey: ACCESS_ID,
    secretKey: ACCESS_SECRET,
});

async function test() {
    try {
        const path = `/v1.0/devices/${DEVICE_ID}/commands`;
        console.log(`Sending command to: ${path}`);

        // Toggle switch_1 (assuming it exists, otherwise this might fail or do nothing)
        // We send 'true' just to see if it accepts the command.
        const commands = [{ code: 'switch_1', value: true }];

        const res = await context.request({
            path: path,
            method: 'POST',
            body: { commands }
        });

        console.log('Success:', res.success);
        console.log('Code:', res.code);
        console.log('Msg:', res.msg);
        if (res.result) {
            console.log('Result:', JSON.stringify(res.result));
        }
    } catch (error) {
        console.error('SCRIPT ERROR:', error);
    }
}

test();
