import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Download, Users, Briefcase, Navigation, Activity } from 'lucide-react';
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
                    <button className="btn-primary">AI REPORT</button>
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
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Network Load</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>74%</h2>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                            <Activity size={24} color="var(--success)" />
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Sessions</p>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.activeUsers / 1000}k</h2>
                        </div>
                        <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)' }}>
                            <Users size={24} color="var(--secondary)" />
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
        </div>
    );
};

export default AdminAnalytics;
