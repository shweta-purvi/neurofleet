import React from 'react';
import { Battery, Fuel, MapPin, Gauge, MoreVertical } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return 'var(--success)';
            case 'IN_USE': return 'var(--primary)';
            case 'MAINTENANCE': return 'var(--warning)';
            case 'CRITICAL': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div className="stat-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '140px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    <MapPin size={14} color="var(--primary)" />
                    {vehicle.location || 'San Francisco, CA'}
                </div>
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <MoreVertical size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    fontSize: '3rem',
                    filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.3))'
                }}>
                    {vehicle.type === 'EV' ? '🚗' : '🚙'}
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{vehicle.model}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>{vehicle.licensePlate}</p>
                    </div>
                    <div style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: `${getStatusColor(vehicle.status)}20`,
                        color: getStatusColor(vehicle.status),
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: `1px solid ${getStatusColor(vehicle.status)}40`
                    }}>
                        {vehicle.status.replace('_', ' ')}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {vehicle.type === 'EV' ? <Battery size={18} color="var(--success)" /> : <Fuel size={18} color="var(--warning)" />}
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{vehicle.type === 'EV' ? 'Battery' : 'Fuel'}</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{vehicle.level}%</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Gauge size={18} color="var(--primary)" />
                        <div>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Speed</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{vehicle.speed} km/h</p>
                        </div>
                    </div>
                </div>

                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${vehicle.level}%`,
                        background: vehicle.level < 20 ? 'var(--danger)' : vehicle.level < 50 ? 'var(--warning)' : 'var(--success)',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
