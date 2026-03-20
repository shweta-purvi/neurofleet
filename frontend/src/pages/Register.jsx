import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User as UserIcon } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(formData.fullName, formData.email, formData.password, formData.role);
            navigate(`/${formData.role.toLowerCase()}/dashboard`);
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || err.response?.data || 'Registration failed. Please check your details.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <div className="logo-text">NeuroFleetX</div>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
                    Join the AI Mobility Revolution
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="fullName"
                                className="input-field"
                                placeholder="John Doe"
                                style={{ paddingLeft: '48px' }}
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                className="input-field"
                                placeholder="name@example.com"
                                style={{ paddingLeft: '48px' }}
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Create Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                className="input-field"
                                placeholder="••••••••"
                                style={{ paddingLeft: '48px' }}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Requested Role</label>
                        <div style={{ position: 'relative' }}>
                            <Shield size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <select
                                name="role"
                                className="input-field"
                                style={{ paddingLeft: '48px', appearance: 'none' }}
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="ADMIN">Administrator</option>
                                <option value="FLEET_MANAGER">Fleet Manager</option>
                                <option value="DRIVER">Service Driver</option>
                                <option value="CUSTOMER">Commuter</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Already in the system? </span>
                    <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
