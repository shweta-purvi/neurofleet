import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Clock, Zap, MapPin, AlertTriangle, Activity } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteOptimizer = () => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [route, setRoute] = useState([]);
    const [optimization, setOptimization] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('neuro_token');
            const response = await axios.get('http://localhost:8080/api/v1/vehicles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data.map(v => ({
                ...v,
                pos: [v.latitude || 37.7749, v.longitude || -122.4194]
            }));
            setVehicles(data);
            if (data.length > 0 && !selectedVehicle) {
                setSelectedVehicle(data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch vehicles:', error);
        }
    };

    const fetchOptimization = async (vId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('neuro_token');
            const savedFactors = localStorage.getItem('neuro_ai_factors');
            let activeParam = 'all';
            if (savedFactors) {
                const factors = JSON.parse(savedFactors);
                activeParam = encodeURIComponent(factors.join(','));
            }

            const response = await axios.get(`http://localhost:8080/api/v1/ai/optimize/${vId}?active=${activeParam}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOptimization(response.data);
        } catch (error) {
            console.error('Optimization failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
        const interval = setInterval(fetchVehicles, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedVehicle) {
            fetchOptimization(selectedVehicle.id);
            const start = [selectedVehicle.latitude || 37.7749, selectedVehicle.longitude || -122.4194];
            const simulatedRoute = [
                start,
                [start[0] + 0.005, start[1] + 0.005],
                [start[0] + 0.010, start[1] + 0.012],
                [start[0] + 0.015, start[1] + 0.010],
            ];
            setRoute(simulatedRoute);
        }
    }, [selectedVehicle?.id]);

    return (
        <div className="main-content">
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Neuro-Route Orchestration</h1>
                    <p style={{ color: 'var(--text-muted)' }}>AI-driven pathfinding for minimum congestion & energy consumption</p>
                </div>
                <div style={{ padding: '12px 20px', background: 'rgba(0, 242, 254, 0.05)', borderRadius: '12px', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>AI MODEL: NEURO-V4.2 ACTIVE</span>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="stat-card" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Select Unit
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {vehicles.map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVehicle(v)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--glass-border)',
                                        background: selectedVehicle?.id === v.id ? 'rgba(0, 242, 254, 0.1)' : 'var(--glass)',
                                        color: selectedVehicle?.id === v.id ? 'var(--primary)' : 'white',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v.model}</p>
                                        <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>{v.licensePlate}</p>
                                    </div>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.status === 'AVAILABLE' ? 'var(--success)' : 'var(--warning)' }}></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {optimization && (
                        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 1), rgba(0, 242, 254, 0.05))', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Activity size={24} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.1rem' }}>Neuro-Analysis</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Predicted ETA</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{optimization.predictedEta}</p>
                                </div>
                                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Factor</p>
                                    <p style={{ fontSize: '1.2rem', fontWeight: 800, color: optimization.riskFactor === 'LOW' ? 'var(--success)' : 'var(--warning)' }}>{optimization.riskFactor}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                                {Object.entries(optimization.neuroFactors).map(([key, value]) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                                        <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                                        <span style={{ fontWeight: 600 }}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,165,0,0.05)', borderRadius: '8px', border: '1px solid rgba(255,165,0,0.1)' }}>
                                <p style={{ fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <AlertTriangle size={12} /> AI LOGIC PROMPT
                                </p>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.4' }}>
                                    "{optimization.optimizationPrompt}"
                                </p>
                            </div>

                            <button
                                onClick={() => fetchOptimization(selectedVehicle.id)}
                                className="btn-primary"
                                style={{ marginTop: '20px' }}
                                disabled={loading}
                            >
                                {loading ? 'RE-ANALYZING...' : 'FORCE RE-OPTIMIZE'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="stat-card" style={{ height: '700px', padding: 0, overflow: 'hidden', position: 'relative' }}>
                    <MapContainer
                        center={[37.7749, -122.4194]}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CARTO'
                        />
                        {vehicles.map(v => (
                            <Marker key={v.id} position={[v.latitude || 37.7749, v.longitude || -122.4194]}>
                                <Popup>
                                    <div style={{ color: '#000' }}>
                                        <strong>{v.model}</strong><br />
                                        Status: {v.status}<br />
                                        Battery: {v.batteryPercentage}%<br />
                                        Weather: {v.currentWeather || 'Clear'}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        {route.length > 0 && (
                            <Polyline
                                positions={route}
                                color="var(--primary)"
                                weight={5}
                                opacity={0.6}
                                dashArray="10, 10"
                            />
                        )}
                    </MapContainer>

                    {/* Floating Legend */}
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, background: 'var(--glass)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', marginBottom: '6px' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            <span>Optimized Path (Eco-Mode)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '50%' }}></div>
                            <span>Active Node</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteOptimizer;
