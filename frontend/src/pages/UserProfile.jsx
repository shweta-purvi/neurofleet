import React, { useState } from 'react';
import axios from 'axios';
import { User as UserIcon, Mail, Shield, Phone, MapPin, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: '+44 (0) 20 7946 0123',
        location: 'London, United Kingdom'
    });
    const [status, setStatus] = useState('');

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('neuro_token');
            const response = await axios.put('http://localhost:8080/api/v1/users/profile', {
                fullName: formData.fullName
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser({ ...user, fullName: response.data.fullName });
            setStatus('Profile updated successfully!');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error('Update failed:', error);
            setStatus('Update failed. Try again.');
        }
    };

    return (
        <div className="main-content">
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Identity Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure your personal profile and security credentials</p>
                </div>
                {status && <div className="badge" style={{ background: status.includes('success') ? 'var(--success)' : 'var(--danger)', color: '#000', padding: '8px 16px', borderRadius: '8px' }}>{status}</div>}
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                <aside>
                    <div className="glass-card" style={{ maxWidth: 'none', textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '3rem',
                                fontWeight: 800,
                                color: '#000'
                            }}>
                                {user?.fullName?.charAt(0)}
                            </div>
                            <button style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                background: 'var(--bg-dark)',
                                border: '1px solid var(--border)',
                                color: 'white',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}>
                                <Camera size={18} />
                            </button>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.fullName}</h3>
                        <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>{user?.role}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px' }}>Member since January 2026</p>
                    </div>

                    <div className="stat-card" style={{ marginTop: '24px' }}>
                        <h4 style={{ fontSize: '1rem', marginBottom: '16px' }}>Security Status</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--success)', marginBottom: '12px' }}>
                            <Shield size={18} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Account Protected</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multi-factor authentication is active for this identity.</p>
                    </div>
                </aside>

                <section>
                    <div className="glass-card" style={{ maxWidth: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px' }}>Personal Information</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        style={{ paddingLeft: '48px' }}
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="email" className="input-field" value={formData.email} readOnly style={{ paddingLeft: '48px', opacity: 0.6 }} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="tel" className="input-field" defaultValue={formData.phone} style={{ paddingLeft: '48px' }} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Location Base</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="text" className="input-field" defaultValue={formData.location} style={{ paddingLeft: '48px' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleUpdate} className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px' }}>
                                <Save size={18} /> UPDATE IDENTITY
                            </button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ maxWidth: 'none', marginTop: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Work Credentials</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Operator ID</p>
                                <p style={{ fontWeight: 700 }}>NEURO-X-9921</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Clearance Level</p>
                                <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Tier 4 Command</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Last Logged In</p>
                                <p style={{ fontWeight: 700 }}>2 mins ago</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserProfile;
