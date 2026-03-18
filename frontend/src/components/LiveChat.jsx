import React, { useState, useEffect } from 'react';
import { Send, X, MessageSquare, AlertTriangle, Zap } from 'lucide-react';

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Neuro-Fleet Dispatcher online. Connection: QUANTUM-SECURE. How can I assist with your mission?' }
    ]);

    const handleSend = (e, textOverride) => {
        if (e) e.preventDefault();
        const msgText = textOverride || input;
        if (!msgText.trim()) return;

        const userMsg = { role: 'user', text: msgText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            let response = "Acknowledged. Processing optimization parameters for your current fleet sector.";
            const msg = input.toLowerCase();

            if (msg.includes('accident') || msg.includes('breakdown')) {
                response = "Emergency protocols active. GPS tracking unit locked. Dispatching medical and technical response to your coordinates.";
            } else if (msg.includes('battery') || msg.includes('fuel')) {
                response = "Battery telemetry received. AI suggests rerouting to the nearest EV Hub (Node 4.2) for inductive fast charging.";
            } else if (msg.includes('traffic')) {
                response = "Real-time traffic density is high (68%). Re-calculating routes using historical entropy data to find optimal path.";
            } else if (msg.includes('ai factors') || msg.includes('prediction')) {
                response = "Current AI Model (V4.2) is analyzing: Traffic Density, Historical Trends, Road Type (Highway/Narrow), Weather (Rainy impact), Peak Hours, Vehicle Health, and Load Weights. Route optimization active.";
            } else if (msg.includes('eta')) {
                response = "Optimized ETA for Fleet Section A is 14.2 minutes, accounting for current city-road congestion and vehicle health status.";
            } else if (msg.includes('status') || msg.includes('fleet')) {
                response = "System Status: OPTIMAL. All nodes operational. 98% Driver Performance Score average maintained.";
            }

            setMessages(prev => [...prev, { role: 'bot', text: response }]);
        }, 1500);
    };

    return (
        <>
            {/* Pulsing Chat Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    border: 'none',
                    boxShadow: '0 0 20px var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1001,
                    animation: 'pulse 2s infinite'
                }}
            >
                {isOpen ? <X size={24} color="#000" /> : <MessageSquare size={24} color="#000" />}
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '24px',
                    width: '400px',
                    height: '550px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    overflow: 'hidden',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)', position: 'absolute', bottom: 0, right: 0, border: '2px solid var(--card-bg)' }}></div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Zap size={20} color="var(--primary)" />
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'white' }}>NEURO DISPATCHER</h3>
                                <p style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>SYSTEMS OPTIMAL</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.2)' }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: m.role === 'user' ? '#000' : 'white',
                                padding: '12px 16px',
                                borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '2px 16px 16px 16px',
                                maxWidth: '85%',
                                fontSize: '0.9rem',
                                border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                                lineHeight: '1.5'
                            }}>
                                {m.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '4px', padding: '10px' }}>
                                <div className="typing-dot"></div>
                                <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
                                <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        )}
                        <div id="chat-end"></div>
                    </div>

                    <div style={{ padding: '10px 20px', background: 'var(--glass)', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {['Optimize Routes', 'Fleet Status', 'Traffic Analysis'].map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(null, chip)}
                                style={{
                                    background: 'rgba(0, 242, 254, 0.1)',
                                    border: '1px solid rgba(0, 242, 254, 0.3)',
                                    color: 'var(--primary)',
                                    padding: '6px 12px',
                                    borderRadius: '100px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '15px 20px', background: 'var(--glass)' }}>
                        <form onSubmit={(e) => handleSend(e, null)} style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Type mission report..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{ marginBottom: 0, borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}
                            />
                            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '12px', borderRadius: '10px' }}>
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div >
            )}

            <style>{`
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(0, 242, 254, 0.4); }
                    70% { box-shadow: 0 0 0 20px rgba(0, 242, 254, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 242, 254, 0); }
                }
                @keyframes slideIn {
                    from { transform: translateY(30px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background: var(--text-muted);
                    borderRadius: 50%;
                    animation: blink 1.4s infinite;
                }
                @keyframes blink {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default LiveChat;
