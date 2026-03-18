import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Search, Edit2, Trash2, ShieldCheck } from 'lucide-react';

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('neuro_token');
            const response = await axios.get('http://localhost:8080/api/v1/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApproveDriver = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('neuro_token');
            await axios.put(`http://localhost:8080/api/v1/users/${id}/approve?approved=${!currentStatus}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this identity?')) return;
        try {
            const token = localStorage.getItem('neuro_token');
            await axios.delete(`http://localhost:8080/api/v1/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error('Deletion failed:', error);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="main-content">
            <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>System Users</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage user identities, roles, and access permissions</p>
                </div>
                <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                    <UserPlus size={18} /> PROVISION USER
                </button>
            </header>

            <div className="glass-card" style={{ maxWidth: 'none', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '20px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Filter by name, email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '44px', marginBottom: 0 }}
                        />
                    </div>
                    <select
                        className="input-field"
                        style={{ width: '200px', marginBottom: 0 }}
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option>All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="FLEET_MANAGER">Fleet Manager</option>
                        <option value="DRIVER">Driver</option>
                        <option value="CUSTOMER">Customer</option>
                    </select>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>USER IDENTITY</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>ACCESS ROLE</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>STATUS</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600 }}>APPROVAL</th>
                            <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#000', flexShrink: 0 }}>
                                            {u.fullName?.charAt(0)}
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.fullName}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--secondary)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700
                                    }}>{u.role}</span>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.status === 'Active' ? 'var(--success)' : 'var(--danger)' }}></div>
                                        <span style={{ fontSize: '0.9rem' }}>{u.status}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '20px 24px' }}>
                                    {u.role === 'DRIVER' ? (
                                        <button
                                            onClick={() => handleApproveDriver(u.id, u.driverApproved)}
                                            style={{
                                                padding: '6px 14px',
                                                borderRadius: '8px',
                                                border: '1px solid',
                                                borderColor: u.driverApproved ? 'var(--success)' : 'var(--warning)',
                                                background: 'transparent',
                                                color: u.driverApproved ? 'var(--success)' : 'var(--warning)',
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {u.driverApproved ? 'APPROVED' : 'PENDING'}
                                        </button>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>N/A</span>
                                    )}
                                </td>
                                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '12px' }}><Edit2 size={18} /></button>
                                    <button
                                        onClick={() => handleDeleteUser(u.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManagement;
