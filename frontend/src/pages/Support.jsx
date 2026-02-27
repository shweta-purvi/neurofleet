import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, ChevronRight, Search, FileText } from 'lucide-react';

const Support = () => {
    const [query, setQuery] = useState('');

    const faqs = [
        { q: "How do I upgrade my fleet clearance?", a: "Clearance upgrades are managed by System Admins. Contact your regional hub lead for authorization codes." },
        { q: "Battery telemetry shows 0% but vehicle is active.", a: "This usually indicates a sensor sync delay. Perform a manual 'Quantum Edge Sync' in Settings." },
        { q: "How are estimated fares calculated?", a: "Our AI model uses real-time traffic density, EV energy consumption, and high-demand surge nodes." },
    ];

    return (
        <div className="main-content">
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Neuro-Support Hub</h1>
                <p style={{ color: 'var(--text-muted)' }}>Get technical assistance or browse our knowledge base</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                <section>
                    <div className="glass-card" style={{ maxWidth: 'none', marginBottom: '32px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Search Knowledge Base</h3>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search for error codes, guides, or tutorials..."
                                style={{ paddingLeft: '52px' }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {faqs.map((faq, i) => (
                            <div key={i} className="stat-card" style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{faq.q}</h4>
                                    <ChevronRight size={18} color="var(--text-muted)" />
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.6' }}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <aside>
                    <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(0, 242, 254, 0.1))', border: '1px solid var(--primary)', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MessageSquare size={20} color="var(--primary)" /> Live Dispatch
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                            Average response time: <strong>2 mins</strong>
                        </p>
                        <button className="btn-primary">START CHAT</button>
                    </div>

                    <div className="glass-card" style={{ maxWidth: 'none' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Direct Contact</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>24/7 Hotline</p>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>+1 (888) NEURO-FLT</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Technical Email</p>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>ops@neurofleetx.ai</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-muted)' }}>Documentation</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button className="btn-text" style={{ fontSize: '0.85rem' }}><FileText size={14} /> Fleet Operator Manual</button>
                            <button className="btn-text" style={{ fontSize: '0.85rem' }}><FileText size={14} /> Safety & Compliance API</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Support;
