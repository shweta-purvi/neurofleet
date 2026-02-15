import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Clock, Zap, MapPin, AlertTriangle } from 'lucide-react';
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
    const [eta, setEta] = useState('0 mins');

    useEffect(() => {
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
        fetchVehicles();
        const interval = setInterval(fetchVehicles, 10000);
        return () => clearInterval(interval);
    }, [selectedVehicle]);

    useEffect(() => {
        if (selectedVehicle) {
            const start = [selectedVehicle.latitude || 37.7749, selectedVehicle.longitude || -122.4194];
            const simulatedRoute = [
                start,
                [start[0] + 0.005, start[1] + 0.005],
                [start[0] + 0.010, start[1] + 0.012],
                [start[0] + 0.015, start[1] + 0.010],
            ];
            setRoute(simulatedRoute);
            setEta(`${Math.floor(Math.random() * 10) + 12} mins`);
        }
    }, [selectedVehicle]);

    return (
        <div className="main-content">
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>AI Route Orchestration</h1>
                <p style={{ color: 'var(--text-muted)' }}>Dynamic energy-efficient pathfinding for fleet vehicles</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="stat-card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Select Vehicle</h3>
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
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{v.model}</p>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>{v.licensePlate}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedVehicle && (
                        <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 1), rgba(0, 242, 254, 0.05))' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <Navigation size={24} color="var(--primary)" />
                                <div>
                                    <h3 style={{ fontSize: '1rem' }}>Active Route</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: RT-{selectedVehicle.id}88</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Travel Time:</span>
                                    <span style={{ fontWeight: 600 }}>{eta}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Energy Mode:</span>
                                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Optimal Eco</span>
                                </div>
                            </div>

                            <button className="btn-primary" style={{ marginTop: '24px' }}>RE-CALCULATE</button>
                        </div>
                    )}
                </div>

                <div className="stat-card" style={{ height: '600px', padding: 0, overflow: 'hidden' }}>
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
                                    <strong>{v.model}</strong><br />
                                    {v.status} | {v.batteryPercentage}% Battery
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
                </div>
            </div>
        </div>
    );
};

export default RouteOptimizer;
