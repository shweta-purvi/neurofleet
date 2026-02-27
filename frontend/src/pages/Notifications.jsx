import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Info, AlertTriangle, CheckCircle, Activity, Filter, Trash2 } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const response = await axios.get('http://localhost:8080/api/v1/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotifications(response.data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('neuro_token');
            await axios.patch(`http://localhost:8080/api/v1/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertTriangle color="var(--danger)" />;
            case 'success': return <CheckCircle color="var(--success)" />;
            case 'info': return <Info color="var(--primary)" />;
            default: return <Bell />;
        }
    };

    return (
        <div className="main-content">
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Signal Center</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Real-time system broadcasts and operational alerts</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                        <Filter size={18} /> FILTER
                    </button>
                    <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: 'var(--danger)' }}>
                        <Trash2 size={18} /> CLEAR ALL
                    </button>
                </div>
            </header >

            <div style={{ maxWidth: '1000px' }}>
                <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {notifications.map(n => (
                        <div key={n.id} className="stat-card" style={{
                            display: 'flex',
                            gap: '20px',
                            background: n.read ? 'var(--card-bg)' : 'rgba(0, 242, 254, 0.05)',
                            borderLeft: n.read ? '1px solid var(--border)' : '4px solid var(--primary)',
                            padding: '24px'
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {getIcon(n.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{n.title}</h4>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</span>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{n.desc}</p>
                            </div>
                            {!n.read && (
                                <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '8px' }}></div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No more signals found in the last 24 hours.</p>
                </div>
            </div>
        </div >
    );
};

export default Notifications;
