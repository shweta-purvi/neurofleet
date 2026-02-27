import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Car, Zap, ShieldCheck } from 'lucide-react';

const Dashboard = ({ title }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        vehicles: 0,
        activeBookings: 0,
        alerts: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const vehiclesRes = await axios.get('http://localhost:8080/api/v1/vehicles', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // For a real app, you'd have specialized dashboard endpoints
                // Here we'll derive some stats from existing ones
                setStats({
                    vehicles: vehiclesRes.data.length,
                    activeBookings: Math.floor(Math.random() * 20) + 5,
                    alerts: vehiclesRes.data.filter(v => v.status === 'CRITICAL').length
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="main-content">
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{title}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Adaptive Intelligence Status: <span style={{ color: 'var(--success)', fontWeight: 600 }}>Optimal</span></p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Node</p>
                        <p style={{ fontWeight: 700 }}>NEURO-SEA-01</p>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid" style={{ padding: 0 }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fleet Capacity</p>
                        <Car size={20} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.vehicles}</h2>
                    <p style={{ color: 'var(--success)', fontSize: '0.75rem', marginTop: '8px' }}>Available across 12 hubs</p>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Load</p>
                        <Activity size={20} color="var(--secondary)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.activeBookings}</h2>
                    <p style={{ color: 'var(--primary)', fontSize: '0.75rem', marginTop: '8px' }}>Peak efficiency reached</p>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Neuro Protection</p>
                        <ShieldCheck size={20} color="var(--success)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>99%</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>Encryption layer active</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '40px' }}>
                <div className="glass-card" style={{ maxWidth: 'none' }}>
                    <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Zap size={20} color="var(--warning)" /> System Pulse
                    </h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${h}%`,
                                background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                                borderRadius: '4px',
                                opacity: 0.7 + (h / 300)
                            }}></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                    </div>
                </div>

                <div className="glass-card" style={{ maxWidth: 'none' }}>
                    <h3 style={{ marginBottom: '20px' }}>AI Model Insight</h3>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
                            "Current traffic density in the downtown sector suggests a 12% increase in travel demand over the next 2 hours.
                            Rerouting 4 available EVs to Hub Alpha for preemptive coverage."
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.7rem' }}>APPROVE</button>
                            <button className="btn-outline" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.7rem' }}>DISMISS</button>
                        </div>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resource Allocation</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>88%</span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: '88%', height: '100%', background: 'var(--primary)' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
