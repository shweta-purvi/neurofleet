import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Eye, Palette, Zap, Check, Lock, Smartphone, Monitor } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('interface');
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('neuro_settings');
        return savedSettings ? JSON.parse(savedSettings) : {
            predictiveOverlay: true,
            autonomousTelemetry: true,
            quantumEdge: false,
            alerts: {
                battery: true,
                maintenance: true,
                messages: true,
                system: false
            },
            incognito: false,
            shareTelemetry: true,
            theme: 'Deep Space',
            density: 'Comfortable'
        };
    });

    useEffect(() => {
        localStorage.setItem('neuro_settings', JSON.stringify(settings));
    }, [settings]);

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAlert = (key) => {
        setSettings(prev => ({
            ...prev,
            alerts: { ...prev.alerts, [key]: !prev.alerts[key] }
        }));
    };

    const tabs = [
        { id: 'interface', label: 'Interface', icon: <Globe size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'security', label: 'Cybersecurity', icon: <Shield size={18} /> },
        { id: 'privacy', label: 'Privacy', icon: <Eye size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    ];

    const Switch = ({ active, onClick }) => (
        <div
            onClick={onClick}
            style={{
                width: '48px',
                height: '24px',
                background: active ? 'var(--primary)' : 'var(--border)',
                borderRadius: '12px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}
        >
            <div style={{
                position: 'absolute',
                left: active ? '26px' : '4px',
                top: '4px',
                width: '16px',
                height: '16px',
                background: active ? '#000' : 'var(--text-muted)',
                borderRadius: '50%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'interface':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Interface Configuration</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>AI Predictive Overlay</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Show real-time AI suggestions during route planning</p>
                            </div>
                            <Switch active={settings.predictiveOverlay} onClick={() => toggleSetting('predictiveOverlay')} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>Autonomous Telemetry</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Background synchronization of vehicle sensor data</p>
                            </div>
                            <Switch active={settings.autonomousTelemetry} onClick={() => toggleSetting('autonomousTelemetry')} />
                        </div>

                        <div style={{
                            background: settings.quantumEdge ? 'rgba(0, 242, 254, 0.1)' : 'rgba(0, 242, 254, 0.05)',
                            border: settings.quantumEdge ? '1px solid var(--primary)' : '1px solid rgba(0, 242, 254, 0.2)',
                            borderRadius: '12px',
                            padding: '24px',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <Zap size={20} color="var(--primary)" />
                                <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Quantum Edge Processing</h4>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                {settings.quantumEdge ? 'Quantum Edge is ACTIVE. Local latency reduced by 45%.' : 'Reducing local latency by 45% via 5G+ offloading.'}
                            </p>
                            <button
                                onClick={() => toggleSetting('quantumEdge')}
                                className={settings.quantumEdge ? "btn-outline" : "btn-primary"}
                                style={{ width: 'auto', marginTop: '16px', padding: '10px 24px', fontSize: '0.8rem' }}
                            >
                                {settings.quantumEdge ? 'DEACTIVATE EDGE' : 'ACTIVATE EDGE'}
                            </button>
                        </div>
                    </div>
                );
            case 'notifications':
                const alertItems = [
                    { key: 'battery', label: 'Battery Critical Alerts' },
                    { key: 'maintenance', label: 'Fleet Maintenance Reminders' },
                    { key: 'messages', label: 'New Message Broadcasts' },
                    { key: 'system', label: 'System Status Updates' }
                ];
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Global Alert Matrix</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {alertItems.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                                    <Switch active={settings.alerts[item.key]} onClick={() => toggleAlert(item.key)} />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Security & Protocols</h3>
                        <div className="stat-card" style={{ background: 'rgba(0, 255, 0, 0.03)', border: '1px solid var(--success)', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                <Lock size={20} color="var(--success)" />
                                <h4 style={{ color: 'var(--success)' }}>Active Protection: Level 4</h4>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Biometric locking and end-to-end encryption are currently enforced.</p>
                        </div>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <button className="btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }} onClick={() => alert('Rotating Keys...')}>Rotate Encryption Keys</button>
                            <button className="btn-outline" style={{ justifyContent: 'flex-start', padding: '16px' }} onClick={() => alert('Enabling 2FA...')}>Enable 2FA via Bio-Node</button>
                            <button className="btn-outline" style={{ justifyContent: 'flex-start', padding: '16px', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => alert('Wiping Session...')}>Wipe Current Session</button>
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Visual Aesthetics</h3>
                        <div>
                            <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Theme Presets</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                {['Deep Space', 'Cyber Neon', 'Alloy Silver'].map((theme, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSettings({ ...settings, theme })}
                                        style={{
                                            aspectRatio: '16/9',
                                            background: i === 0 ? '#020617' : i === 1 ? '#0a0a0a' : '#1e293b',
                                            borderRadius: '12px',
                                            border: settings.theme === theme ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            padding: '12px',
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: settings.theme === theme ? 'var(--primary)' : 'white' }}>{theme}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Density</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    className={settings.density === 'Compact' ? "btn-primary" : "btn-outline"}
                                    onClick={() => setSettings({ ...settings, density: 'Compact' })}
                                    style={{ width: 'auto', padding: '8px 20px', fontSize: '0.8rem' }}
                                >
                                    Compact
                                </button>
                                <button
                                    className={settings.density === 'Comfortable' ? "btn-primary" : "btn-outline"}
                                    onClick={() => setSettings({ ...settings, density: 'Comfortable' })}
                                    style={{ width: 'auto', padding: '8px 20px', fontSize: '0.8rem' }}
                                >
                                    Comfortable
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'privacy':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Privacy & Data</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>Incognito Route Mode</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Don't store mission history in local logs.</p>
                                </div>
                                <Switch active={settings.incognito} onClick={() => toggleSetting('incognito')} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: 600 }}>Share Telemetry with Hubs</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Allow fleet leads to view your live performance meta-data.</p>
                                </div>
                                <Switch active={settings.shareTelemetry} onClick={() => toggleSetting('shareTelemetry')} />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="main-content">
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>System Control Center</h1>
                <p style={{ color: 'var(--text-muted)' }}>Customize your application experience and data preferences</p>
            </header>

            <div style={{ maxWidth: '1000px' }}>
                <div className="glass-card" style={{ maxWidth: 'none', padding: '0', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: '600px' }}>
                        {/* Sidebar */}
                        <aside style={{ borderRight: '1px solid var(--border)', padding: '32px 24px', background: 'rgba(255,255,255,0.01)' }}>
                            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {tabs.map(tab => (
                                    <div
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            padding: '12px 16px',
                                            background: activeTab === tab.id ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                                            color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                            borderRadius: '12px',
                                            fontWeight: activeTab === tab.id ? 600 : 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}>
                                        {tab.icon} {tab.label}
                                    </div>
                                ))}
                            </nav>
                        </aside>

                        {/* Content Area */}
                        <div style={{ padding: '48px' }}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
