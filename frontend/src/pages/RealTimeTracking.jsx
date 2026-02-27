import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, Info, Shield, Radio, Activity } from 'lucide-react';

const RealTimeTracking = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const response = await axios.get('http://localhost:8080/api/v1/vehicles', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Map real data to display coordinates if not present
                const mapped = response.data.map((v, i) => ({
                    ...v,
                    plate: v.licensePlate,
                    status: v.status || 'Active',
                    battery: v.batteryPercentage || 100,
                    // If no real coords, use a spread for visualization
                    x: v.latitude ? (v.latitude % 1) * 20000 : 100 + (i * 150),
                    y: v.longitude ? (Math.abs(v.longitude) % 1) * 20000 : 100 + (i * 100)
                }));
                setVehicles(mapped);
            } catch (error) {
                console.error('Failed to fetch telemetry:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
        const interval = setInterval(fetchVehicles, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setVehicles(prev => prev.map(v => {
                if (v.status !== 'IDLE') {
                    return {
                        ...v,
                        x: v.x + (Math.random() - 0.5) * 5,
                        y: v.y + (Math.random() - 0.5) * 5
                    };
                }
                return v;
            }));
        }, 1000);
        return () => clearInterval(moveInterval);
    }, [vehicles.length]);

    return (
        <div className="main-content">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Global Fleet Telemetry</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time spatial visualization of active urban assets</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', height: 'calc(100vh - 200px)' }}>
                {/* Simulated Map */}
                <div className="glass-card" style={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: 0,
                    background: 'rgba(2, 6, 23, 0.8)',
                    maxWidth: 'none'
                }}>
                    <div className="map-grid-overlay" style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        opacity: 0.1
                    }}></div>

                    {/* Urban Grid Lines (Mock Streets) */}
                    <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, height: '2px', background: 'var(--border)', opacity: 0.2 }}></div>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'var(--border)', opacity: 0.2 }}></div>
                    <div style={{ position: 'absolute', top: '80%', left: 0, right: 0, height: '2px', background: 'var(--border)', opacity: 0.2 }}></div>
                    <div style={{ position: 'absolute', left: '30%', top: 0, bottom: 0, width: '2px', background: 'var(--border)', opacity: 0.2 }}></div>
                    <div style={{ position: 'absolute', left: '60%', top: 0, bottom: 0, width: '2px', background: 'var(--border)', opacity: 0.2 }}></div>

                    {/* Vehicles on Map */}
                    {vehicles.map(v => (
                        <div
                            key={v.id}
                            style={{
                                position: 'absolute',
                                left: `${v.x}px`,
                                top: `${v.y}px`,
                                transition: 'all 1s linear',
                                cursor: 'pointer',
                                zIndex: selectedVehicle?.id === v.id ? 10 : 1
                            }}
                            onClick={() => setSelectedVehicle(v)}
                        >
                            <div style={{
                                width: '12px',
                                height: '12px',
                                background: v.status === 'Active' ? 'var(--primary)' : v.status === 'Idle' ? 'var(--warning)' : 'var(--secondary)',
                                borderRadius: '50%',
                                boxShadow: `0 0 15px ${v.status === 'Active' ? 'var(--primary)' : 'var(--warning)'}`,
                                position: 'relative'
                            }}>
                                <div className="ping-animation" style={{
                                    position: 'absolute',
                                    inset: '-10px',
                                    border: '2px solid var(--primary)',
                                    borderRadius: '50%',
                                    opacity: 0,
                                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                                }}></div>
                            </div>
                            {selectedVehicle?.id === v.id && (
                                <div className="glass-card" style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '0',
                                    width: '180px',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    zIndex: 20
                                }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{v.model}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{v.plate}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ position: 'absolute', bottom: '20px', left: '20px' }} className="badge">LIVE TRACKING ACTIVE</div>
                </div>

                {/* Sidebar Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="stat-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Radio size={18} color="var(--primary)" /> Signal Strength
                        </h3>
                        <div style={{ height: '4px', width: '100%', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '94%', height: '100%', background: 'var(--success)' }}></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-muted)' }}>94% Uplink - Hub Delta</p>
                    </div>

                    <div className="stat-card" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Vehicle Registry</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {vehicles.map(v => (
                                <div
                                    key={v.id}
                                    onClick={() => setSelectedVehicle(v)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: selectedVehicle?.id === v.id ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${selectedVehicle?.id === v.id ? 'var(--primary)' : 'transparent'}`,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v.plate}</span>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            color: v.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                                            fontWeight: 700
                                        }}>{v.status}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ flex: 1, height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                                            <div style={{ width: `${v.battery}%`, height: '100%', background: v.battery > 30 ? 'var(--primary)' : 'var(--danger)' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{v.battery}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ping {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default RealTimeTracking;
