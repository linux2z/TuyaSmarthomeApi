const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const context = new TuyaContext({
    baseUrl: process.env.TUYA_API_ENDPOINT,
    accessKey: process.env.TUYA_ACCESS_ID,
    secretKey: process.env.TUYA_ACCESS_SECRET,
});

async function testEndpoint(name, path, method = 'GET') {
    try {
        console.log(`\nTesting ${name}: ${path}`);
        const res = await context.request({ path, method });
        console.log(`Success: ${res.success}, Code: ${res.code}`);
        if (res.result) {
            const isArray = Array.isArray(res.result) || (res.result.list && Array.isArray(res.result.list));
            console.log(`Result: ${isArray ? 'List Found' : 'Object'}`);
            if (!isArray) console.log(JSON.stringify(res.result).substring(0, 100) + '...');
        } else {
            console.log('Msg:', res.msg);
        }
    } catch (e) {
        console.log('Error:', e.message);
    }
}

async function run() {
    // 1. Standard Device Management List
    await testEndpoint('Device Mgmt List', '/v1.0/devices');

    // 2. IoT Core Device List (often used)
    await testEndpoint('IoT Core List', '/v1.0/iot-03/devices');

    // 3. User List (to get UID)
    await testEndpoint('User List', '/v1.0/users');

    // 4. Associated Users
    await testEndpoint('Associated Users', '/v1.0/iot-01/associated-users');
}

run();
