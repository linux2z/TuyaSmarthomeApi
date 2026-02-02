const { TuyaContext } = require('@tuya/tuya-connector-nodejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const context = new TuyaContext({
    baseUrl: process.env.TUYA_API_ENDPOINT,
    accessKey: process.env.TUYA_ACCESS_ID,
    secretKey: process.env.TUYA_ACCESS_SECRET,
});

async function run() {
    try {
        console.log('Fetching Associated Users...');
        // Correct endpoint for linked Tuya App accounts
        const res = await context.request({ path: '/v1.0/iot-01/associated-users', method: 'GET' });

        console.log('Success:', res.success);
        if (res.result) {
            console.log('Result:', JSON.stringify(res.result));
        } else {
            console.log('Msg:', res.msg);
            console.log('Code:', res.code);
        }

    } catch (e) {
        console.log('Error:', e.message);
    }
}
run();
