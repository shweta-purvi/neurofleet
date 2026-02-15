import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { AlertTriangle, Settings, CheckCircle, Clock } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const MaintenanceAnalytics = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const response = await axios.get('http://localhost:8080/api/v1/maintenance', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecords(response.data);
            } catch (error) {
                console.error('Failed to fetch maintenance records:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    const healthTrend = {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [
            {
                label: 'Fleet Health Index',
                data: [98, 97, 95, 96, 94, 95, 98],
                borderColor: '#00f2fe',
                backgroundColor: 'rgba(0, 242, 254, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    if (loading) return <div className="main-content">Loading diagnostics...</div>;

    return (
        <div className="main-content">
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Predictive Diagnostics</h1>
                <p style={{ color: 'var(--text-muted)' }}>AI-driven vehicle health monitoring and maintenance alerts</p>
            </header>

            <div className="dashboard-grid" style={{ padding: 0, marginBottom: '32px' }}>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>System Integrity</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>98.2%</h2>
                    <p style={{ color: 'var(--success)', fontSize: '0.75rem', marginTop: '8px' }}>Optimal Performance</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Service</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{records.filter(r => r.status === 'PENDING').length}</h2>
                    <p style={{ color: 'var(--warning)', fontSize: '0.75rem', marginTop: '8px' }}>Action required soon</p>
                </div>
                <div className="stat-card" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Critical Alerts</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{records.filter(r => r.status === 'CRITICAL').length}</h2>
                    <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '8px' }}>Immediate attention</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div className="stat-card">
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Live Maintenance Queue</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {records.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '16px', opacity: 0.5 }} />
                                <p style={{ color: 'var(--text-muted)' }}>All systems green. No active tasks.</p>
                            </div>
                        ) : (
                            records.map(record => (
                                <div key={record.id} style={{
                                    padding: '20px',
                                    borderRadius: '12px',
                                    background: 'var(--glass)',
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{
                                            padding: '12px',
                                            borderRadius: '10px',
                                            background: record.status === 'CRITICAL' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: record.status === 'CRITICAL' ? 'var(--danger)' : 'var(--warning)'
                                        }}>
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{record.issue}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {record.vehicle.model} • {record.vehicle.licensePlate}
                                            </p>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        background: 'rgba(255,255,255,0.05)',
                                        textTransform: 'uppercase'
                                    }}>{record.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="stat-card">
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Fleet Fatigue Index</h3>
                    <div style={{ height: '300px' }}>
                        <Line data={healthTrend} options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                            }
                        }} />
                    </div>
                    <div style={{ marginTop: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <Settings size={20} color="var(--primary)" />
                            <p style={{ fontSize: '0.9rem' }}>Smart Sensor Sync <span style={{ color: 'var(--success)' }}>Active</span></p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Clock size={20} color="var(--secondary)" />
                            <p style={{ fontSize: '0.9rem' }}>Next Batch Update: <span style={{ fontWeight: 600 }}>14m 22s</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceAnalytics;
