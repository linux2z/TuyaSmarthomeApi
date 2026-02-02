import { TuyaContext } from '@tuya/tuya-connector-nodejs';

const context = new TuyaContext({
  baseUrl: (process.env.TUYA_API_ENDPOINT || 'https://openapi.tuyus.com').trim(),
  accessKey: (process.env.TUYA_ACCESS_ID || '').trim(),
  secretKey: (process.env.TUYA_ACCESS_SECRET || '').trim(),
});

export default context;
