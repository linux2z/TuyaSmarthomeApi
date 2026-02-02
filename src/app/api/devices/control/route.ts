import { NextResponse } from 'next/server';
import context from '@/lib/tuya';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { deviceId, commands } = body;

        if (!deviceId || !commands) {
            return NextResponse.json({ error: 'Missing deviceId or commands' }, { status: 400 });
        }

        const res = await context.request({
            path: `/v1.0/devices/${deviceId}/commands`,
            method: 'POST',
            body: {
                commands
            }
        });

        if (!res.success) {
            console.error('Tuya Control Error:', res);
            return NextResponse.json({ error: res.msg, code: res.code }, { status: 500 });
        }

        return NextResponse.json(res.result);
    } catch (error: any) {
        console.error('Tuya Control Request Failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
