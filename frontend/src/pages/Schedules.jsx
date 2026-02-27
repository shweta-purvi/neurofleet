import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';

const Schedules = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const response = await axios.get('http://localhost:8080/api/v1/schedules/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAssignments(response.data);
            } catch (error) {
                console.error('Failed to fetch schedules:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedules();
    }, []);

    return (
        <div className="main-content">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Driver Schedules</h1>
                <p style={{ color: 'var(--text-muted)' }}>Assigned shifts and transit orchestration for today</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <section>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem' }}>TODAY</button>
                        <button className="btn-outline" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem' }}>WEEKLY VIEW</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {assignments.map(item => (
                            <div key={item.id} className="stat-card" style={{
                                display: 'flex',
                                gap: '24px',
                                borderLeft: `4px solid ${item.status === 'COMPLETED' ? 'var(--success)' : item.status === 'ONGOING' ? 'var(--primary)' : 'var(--border)'}`
                            }}>
                                <div style={{ minWidth: '80px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[0]}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[1]}</p>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.origin} → {item.destination}</h4>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: item.status === 'COMPLETED' ? 'var(--success)' : item.status === 'ONGOING' ? 'var(--primary)' : 'var(--text-muted)'
                                        }}>{item.status}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{item.routeName} • {item.vehicle?.model} ({item.vehicle?.licensePlate})</p>
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <Clock size={14} /> Assigned
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <MapPin size={14} /> Active Path
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ChevronRight size={24} color="var(--border)" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <aside>
                    <div className="glass-card" style={{ maxWidth: 'none', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertCircle size={20} color="var(--warning)" /> Daily Briefing
                        </h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                            High traffic expected on Interstate 5 during your 03:00 PM shift.
                            AI suggested alternative via 5th Avenue optimized for EV range.
                        </p>
                        <button className="btn-text" style={{ marginTop: '16px' }}>READ FULL BRIEF →</button>
                    </div>

                    <div className="stat-card">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Performance Metrics</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                                    <span>Punctuality Rate</span>
                                    <span style={{ color: 'var(--success)' }}>98%</span>
                                </div>
                                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                                    <div style={{ width: '98%', height: '100%', background: 'var(--success)' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                                    <span>Energy Efficiency</span>
                                    <span style={{ color: 'var(--primary)' }}>A+</span>
                                </div>
                                <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                                    <div style={{ width: '92%', height: '100%', background: 'var(--primary)' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Schedules;
