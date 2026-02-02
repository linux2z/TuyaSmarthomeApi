const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const context = new TuyaContext({
    baseUrl: (process.env.TUYA_API_ENDPOINT || '').trim(),
    accessKey: (process.env.TUYA_ACCESS_ID || '').trim(),
    secretKey: (process.env.TUYA_ACCESS_SECRET || '').trim(),
});

async function run() {
    const uid = (process.env.TUYA_UID || '').trim();
    try {
        console.log('Fetching detailed device list...');
        const res = await context.request({
            path: `/v1.0/users/${uid}/devices`,
            method: 'GET',
        });

        if (res.result) {
            // Log full details of the first 5 devices to identify schemas
            const devices = Array.isArray(res.result) ? res.result : [];
            console.log(JSON.stringify(devices.slice(0, 5), null, 2));
        } else {
            console.log('No result found');
        }
    } catch (e) {
        console.error(e);
    }
}
run();
