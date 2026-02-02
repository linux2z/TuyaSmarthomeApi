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
            const devices = Array.isArray(res.result) ? res.result : [];
            console.log(`\nFound ${devices.length} devices. Analyzing Function & Status codes:\n`);

            devices.forEach(d => {
                console.log('------------------------------------------------');
                console.log(`Device: ${d.name} (${d.category})`);
                console.log(`ID: ${d.id}`);

                console.log('Status:');
                if (d.status) {
                    d.status.forEach(s => {
                        console.log(`  - ${s.code}: ${s.value}`);
                    });
                } else {
                    console.log('  (No status provided)');
                }

                // Check for 'functions' if available (sometimes it is, sometimes not in this endpoint)
                // If not, we have to infer from status or fetch specifications
                if (d.functions) {
                    console.log('Functions:');
                    d.functions.forEach(f => {
                        console.log(`  - ${f.code} (${f.type}): ${JSON.stringify(f.values)}`);
                    });
                }
                console.log('');
            });

        } else {
            console.log('No result found');
        }
    } catch (e) {
        console.error(e);
    }
}
run();
