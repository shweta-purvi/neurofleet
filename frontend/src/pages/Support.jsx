import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, ChevronRight, Search, FileText, X, Send } from 'lucide-react';

const Support = () => {
    const [query, setQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Neuro-Fleet Dispatcher online. State your vehicle ID or issue.' }
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = { role: 'user', text: chatInput };
        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botMsg = {
                role: 'bot',
                text: chatInput.toLowerCase().includes('accident')
                    ? 'Emergency protocols active. GPS tracking unit locked. Dispatching medical and technical response.'
                    : 'Acknowledged. Processing optimization parameters for your current fleet sector.'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1500);
    };

    const faqs = [
        { q: "How do I upgrade my fleet clearance?", a: "Clearance upgrades are managed by System Admins. Contact your regional hub lead for authorization codes." },
        { q: "Battery telemetry shows 0% but vehicle is active.", a: "This usually indicates a sensor sync delay. Perform a manual 'Quantum Edge Sync' in Settings." },
        { q: "How are estimated fares calculated?", a: "Our AI model uses real-time traffic density, EV energy consumption, and high-demand surge nodes." },
        { q: "Can I use the app offline?", a: "Yes, basic route tracking works offline. Data will sync once you are back in a 5G/Quantum Node range." },
        { q: "What is the mission protocol?", a: "Mission protocol ensures all fleet operations follow the safety guidelines set by the Global Transport Council." }
    ];

    const filteredFaqs = faqs.filter(f =>
        f.q.toLowerCase().includes(query.toLowerCase()) ||
        f.a.toLowerCase().includes(query.toLowerCase())
    );

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
                        {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
                            <div
                                key={i}
                                className="stat-card"
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{faq.q}</h4>
                                    <ChevronRight
                                        size={18}
                                        color="var(--text-muted)"
                                        style={{
                                            transform: expandedFaq === i ? 'rotate(90deg)' : 'rotate(0)',
                                            transition: 'transform 0.3s'
                                        }}
                                    />
                                </div>
                                {expandedFaq === i && (
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-muted)',
                                        marginTop: '12px',
                                        lineHeight: '1.6',
                                        animation: 'fadeIn 0.3s ease'
                                    }}>
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        )) : (
                            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                                <HelpCircle size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                                <p>No results found for "{query}"</p>
                            </div>
                        )}
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
                        <button className="btn-primary" onClick={() => setIsChatOpen(true)}>START LIVE DISPATCH</button>
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
                            <button
                                className="btn-text"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => alert('Downloading Fleet Operator Manual...')}
                            >
                                <FileText size={14} /> Fleet Operator Manual
                            </button>
                            <button
                                className="btn-text"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => alert('Accessing Safety & Compliance API Docs...')}
                            >
                                <FileText size={14} /> Safety & Compliance API
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Live Chat Modal/Overlay */}
            {isChatOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '380px',
                    height: '500px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>NEURO DISPATCHER</h3>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                    </div>

                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: m.role === 'user' ? '#000' : 'white',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                maxWidth: '80%',
                                fontSize: '0.9rem',
                                border: m.role === 'user' ? 'none' : '1px solid var(--border)'
                            }}>
                                {m.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Dispatcher is typing...</div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Type report or query..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            style={{ marginBottom: 0, borderRadius: '8px' }}
                        />
                        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px' }}><Send size={18} /></button>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Support;
