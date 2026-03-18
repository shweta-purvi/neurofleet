import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Download, Users, Briefcase, Navigation, Activity, AlertTriangle, Globe, Clock, BarChart3 } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminAnalytics = () => {
    const [vehicles, setVehicles] = useState([]);
    const [stats, setStats] = useState({
        totalTrips: 8432,
        activeUsers: 12800,
        avgTime: 18
    });
    const [activeFactors, setActiveFactors] = useState(() => {
        const saved = localStorage.getItem('neuro_ai_factors');
        return saved ? JSON.parse(saved) : [];
    });

    const toggleFactor = (factorLabel) => {
        let newFactors;
        if (activeFactors.includes(factorLabel)) {
            newFactors = activeFactors.filter(f => f !== factorLabel);
        } else {
            newFactors = [...activeFactors, factorLabel];
        }
        setActiveFactors(newFactors);
        localStorage.setItem('neuro_ai_factors', JSON.stringify(newFactors));
    };

    useEffect(() => {
        const fetchFleet = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const response = await axios.get('http://localhost:8080/api/v1/vehicles', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVehicles(response.data);
            } catch (error) {
                console.error('Failed to fetch fleet for analytics:', error);
            }
        };
        fetchFleet();
        const interval = setInterval(fetchFleet, 30000);
        return () => clearInterval(interval);
    }, []);

    const rentalActivity = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'Hourly Fleet Utilization',
                data: [120, 240, 680, 540, 890, 450],
                backgroundColor: 'rgba(0, 242, 254, 0.6)',
                borderRadius: 8
            }
        ]
    };

    const activeVehicles = vehicles.filter(v => v.status === 'IN_USE').length;
    const utilization = vehicles.length > 0 ? Math.round((activeVehicles / vehicles.length) * 100) : 0;
    const alertCount = vehicles.filter(v => v.status === 'CRITICAL').length;

    return (
        <div className="main-content">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Urban Mobility Intelligence</h1>
                    <p style={{ color: 'var(--text-muted)' }}>City-wide fleet distribution and demand analytics</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} /> EXPORT CSV
                    </button>
                    <button className="btn-primary" onClick={() => alert('AI Report Generated: Fleet Optimal')}>AI REPORT</button>
                </div>
            </header>

            <div className="dashboard-grid" style={{ padding: 0, marginBottom: '32px' }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fleet Capacity</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{vehicles.length}</h2>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.1)' }}>
                            <Navigation size={24} color="var(--primary)" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Network Utilization</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{utilization}%</h2>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Activity size={24} color="var(--success)" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Critical Signals</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{alertCount}</h2>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)' }}>
                            <AlertTriangle size={24} color="var(--danger)" />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div className="stat-card" style={{ height: '500px', padding: 0, overflow: 'hidden', position: 'relative' }}>
                    <MapContainer center={[37.7749, -122.4194]} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                        {vehicles.map((v, i) => (
                            <CircleMarker
                                key={i}
                                center={[v.latitude || 37.7749, v.longitude || -122.4194]}
                                radius={10}
                                fillColor="var(--primary)"
                                color="transparent"
                                fillOpacity={0.6}
                            >
                                <Popup>{v.model} | {v.status}</Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>

                <div className="stat-card" style={{ height: '500px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Fleet Utilization</h3>
                    <div style={{ height: '400px' }}>
                        <Bar data={rentalActivity} options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                            }
                        }} />
                    </div>
                </div>
            </div>

            <div className="stat-card" style={{ marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Zap size={24} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.2rem' }}>Global AI Predictive Factors (Real-time)</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {[
                        { label: 'Current Traffic Density', value: 'High Density (Sync: 0.4s)', icon: <Activity size={16} /> },
                        { label: 'Weather Conditions', value: 'Dynamic Shift Detected', icon: <Globe size={16} /> },
                        { label: 'Peak Hour Status', value: 'Active (Congestion x1.4)', icon: <Clock size={16} /> },
                        { label: 'Vehicle Health Status', value: 'Fleet Integrity 96.2%', icon: <Zap size={16} /> },
                        { label: 'Historical Traffic Data', value: 'ML Training Set v12.4', icon: <BarChart3 size={16} /> },
                        { label: 'Accident / Roadblock Data', value: 'Live Feed Tracking', icon: <AlertTriangle size={16} /> },
                        { label: 'Driver Performance Score', value: 'Real-time Telemetry', icon: <Users size={16} /> },
                        { label: 'EV Charging Availability', value: 'Distribution Optimized', icon: <Briefcase size={16} /> },

                    ].map((factor, i) => {
                        const isFactorActive = activeFactors.length === 0 || activeFactors.includes(factor.label);
                        return (
                            <div
                                key={i}
                                onClick={() => toggleFactor(factor.label)}
                                style={{
                                    padding: '16px',
                                    background: isFactorActive ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    border: isFactorActive ? '1px solid rgba(0, 242, 254, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    opacity: isFactorActive ? 1 : 0.5,
                                    transition: 'all 0.2s'
                                }}>
                                <div style={{ color: isFactorActive ? 'var(--primary)' : 'var(--text-muted)' }}>{factor.icon}</div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                                        {factor.label}
                                        <span style={{ color: isFactorActive ? 'var(--success)' : 'var(--text-muted)' }}>{isFactorActive ? 'ACTIVE' : 'DISABLED'}</span>
                                    </p>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: isFactorActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{isFactorActive ? factor.value : 'Integration Paused'}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(0, 242, 254, 0.05)', borderRadius: '12px', border: '1px dashed var(--primary)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        NeuroFleetX AI is currently processing 15+ concurrent factors including <span style={{ color: 'var(--primary)' }}>Load Weight, Narrow Road Analysis, Pickup-Drop Coordinates, and Idle Time Minimization</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
