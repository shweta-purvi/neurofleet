import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleCard from '../components/VehicleCard';
import { Plus, Search, Filter } from 'lucide-react';

const FleetInventory = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const response = await axios.get('http://localhost:8080/api/v1/vehicles', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setVehicles(response.data);
            } catch (error) {
                console.error('Failed to fetch vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
        const interval = setInterval(fetchVehicles, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="main-content">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Fleet Inventory</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time telemetry and vehicle status monitoring</p>
                </div>
                <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} />
                    ADD VEHICLE
                </button>
            </header>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search by license plate, model or location..."
                        style={{ paddingLeft: '48px', marginBottom: 0 }}
                    />
                </div>
                <button className="input-field" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <Filter size={18} />
                    FILTER
                </button>
            </div>

            <div className="dashboard-grid" style={{ padding: 0 }}>
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
            </div>
        </div>
    );
};

export default FleetInventory;
