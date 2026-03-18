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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {vehicle.type === 'EV BUS' ? <Battery size={16} color="var(--success)" /> : <Fuel size={16} color="var(--warning)" />}
                        <div>
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{vehicle.type === 'EV BUS' ? 'Battery' : 'Fuel'}</p>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{vehicle.batteryPercentage ? vehicle.batteryPercentage : vehicle.fuelLevel}%</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Gauge size={16} color="var(--primary)" />
                        <div>
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Speed</p>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{vehicle.speed} km/h</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Load Weight</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>{vehicle.loadWeight || 0} kg</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Tire Pressure</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>{vehicle.tirePressure || 0} PSI</p>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Weather</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{vehicle.currentWeather || 'Clear'}</p>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Traffic</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: (vehicle.trafficDensity > 50 ? 'var(--danger)' : 'var(--success)') }}>{vehicle.trafficDensity || 0}%</p>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <p style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Road Type</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700 }}>{vehicle.roadType || 'City'}</p>
                    </div>
                </div>

                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${vehicle.batteryPercentage ? vehicle.batteryPercentage : vehicle.fuelLevel}%`,
                        background: (vehicle.batteryPercentage ? vehicle.batteryPercentage : vehicle.fuelLevel) < 20 ? 'var(--danger)' : (vehicle.batteryPercentage ? vehicle.batteryPercentage : vehicle.fuelLevel) < 50 ? 'var(--warning)' : 'var(--success)',
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                    }}></div>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;
