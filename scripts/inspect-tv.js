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
        // 1. Get List to find the TV
        const res = await context.request({
            path: `/v1.0/users/${uid}/devices`,
            method: 'GET',
        });

        if (!res.result) return console.log('No devices');

        const devices = Array.isArray(res.result) ? res.result : [];
        const tv = devices.find(d => d.category === 'tv' || d.category === 'infrared_tv' || d.name.toLowerCase().includes('tv'));

        if (!tv) {
            console.log('No TV found in device list.');
            return;
        }

        console.log(`Found TV: ${tv.name} (ID: ${tv.id}, Category: ${tv.category})`);

        // 2. Fetch Specifications
        const specRes = await context.request({
            path: `/v1.0/devices/${tv.id}/specifications`,
            method: 'GET',
        });

        console.log('Specifications:', JSON.stringify(specRes, null, 2));

        // 3. Dump functions directly from device object too
        console.log('Device Object Functions:', JSON.stringify(tv.functions, null, 2));

    } catch (e) {
        console.error(e);
    }
}
run();
