'use client';

import { useEffect, useState } from 'react';

// --- Icons ---
const IconPower = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>;
const IconTv = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>;
const IconPlug = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v5M9 22v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4M18 9l-2 2H8L6 9M18 5h-1M7 5H6M12 11v5"></path></svg>;
const IconCamera = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconSwitch = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line></svg>;

export default function Home() {
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchDevices() {
            try {
                const res = await fetch('/api/devices');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to fetch devices');
                }

                const deviceList = Array.isArray(data.result) ? data.result : (data.result?.list || []);
                setDevices(deviceList);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDevices();
    }, []);

    async function sendCommand(device: any, code: string, value: any) {
        // Optimistic Update
        setDevices(prev => prev.map(d => {
            if (d.id === device.id) {
                const newStatus = d.status ? d.status.map((s: any) => s.code === code ? { ...s, value } : s) : [];
                if (!newStatus.find((s: any) => s.code === code)) {
                    newStatus.push({ code, value });
                }
                return { ...d, status: newStatus };
            }
            return d;
        }));

        try {
            const res = await fetch('/api/devices/control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId: device.id, commands: [{ code, value }] })
            });

            if (!res.ok) {
                const err = await res.json();
                alert('Failed: ' + (err.error || 'Unknown error'));
            }
        } catch (e: any) {
            alert('Error: ' + e.message);
        }
    }

    const getDeviceIcon = (category: string) => {
        switch (category) {
            case 'tv':
            case 'infrared_tv': return <IconTv />;
            case 'cz':
            case 'pc': return <IconPlug />;
            case 'sp': return <IconCamera />;
            default: return <IconSwitch />;
        }
    };

    return (
        <main className="container">
            <header style={{ padding: '3rem 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', letterSpacing: '-0.05em' }}>Smart Home</h1>
                <p style={{ color: 'var(--text-muted)' }}>Everything is under control</p>
            </header>

            {error && (
                <div className="glass-panel" style={{ padding: '1rem', color: '#f87171', marginBottom: '2rem', borderLeft: '4px solid #f87171' }}>
                    <h3>Connection Error</h3>
                    <p>{error}</p>
                </div>
            )}

            {loading ? (
                <div className="grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-panel card" style={{ height: '300px', animation: 'pulse 2s infinite' }}>
                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid">
                    {devices.map((device: any) => (
                        <div key={device.id} className="glass-panel card" style={{ justifyContent: 'flex-start', transition: 'all 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        padding: '0.75rem',
                                        background: device.online ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        color: device.online ? 'var(--primary)' : '#666'
                                    }}>
                                        {getDeviceIcon(device.category)}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{device.name}</h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{device.category}</p>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    backgroundColor: device.online ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                    color: device.online ? '#4ade80' : '#f87171'
                                }}>
                                    {device.online ? 'Online' : 'Offline'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
                                {device.status && device.status.length > 0 ? device.status.sort().map((status: any) => {
                                    if (typeof status.value === 'boolean' || status.code.startsWith('switch')) {
                                        return (
                                            <div key={status.code} style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.75rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '10px'
                                            }}>
                                                <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{status.code.replace(/_/g, ' ')}</span>
                                                <button
                                                    className={`btn ${status.value ? 'active' : ''}`}
                                                    style={{
                                                        padding: '0.4rem 1rem',
                                                        fontSize: '0.7rem',
                                                        background: status.value ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                        borderColor: status.value ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                        borderRadius: '8px'
                                                    }}
                                                    onClick={() => sendCommand(device, status.code, !status.value)}
                                                >
                                                    {status.value ? 'ACTIVE' : 'OFF'}
                                                </button>
                                            </div>
                                        );
                                    }
                                    return null;
                                }) : (
                                    <div style={{ width: '100%' }}>
                                        {(device.category === 'infrared_tv' || device.category === 'tv' || device.name?.toLowerCase().includes('tv')) ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', padding: '0.5rem' }}>
                                                <button
                                                    onClick={() => sendCommand(device, 'Power', true)}
                                                    className="btn"
                                                    style={{ background: '#ef4444', borderColor: '#ef4444', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                                >
                                                    <IconPower /> POWER
                                                </button>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
                                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                                        <p style={{ fontSize: '0.65rem', color: '#666', marginBottom: '0.5rem' }}>VOLUME</p>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button onClick={() => sendCommand(device, 'Volume+', true)} className="btn" style={{ flex: 1 }}>+</button>
                                                            <button onClick={() => sendCommand(device, 'Volume-', true)} className="btn" style={{ flex: 1 }}>-</button>
                                                        </div>
                                                    </div>
                                                    <div style={{ flex: 1, textAlign: 'center' }}>
                                                        <p style={{ fontSize: '0.65rem', color: '#666', marginBottom: '0.5rem' }}>CHANNEL</p>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button onClick={() => sendCommand(device, 'Channel+', true)} className="btn" style={{ flex: 1 }}>+</button>
                                                            <button onClick={() => sendCommand(device, 'Channel-', true)} className="btn" style={{ flex: 1 }}>-</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#444', background: 'rgba(0,0,0,0.1)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                                                Ready to Control
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
