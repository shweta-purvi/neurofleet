import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Zap, Shield, Map, Activity, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = localStorage.getItem('neuro_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser.role) {
                const rolePath = parsedUser.role.toLowerCase();
                navigate(`/${rolePath}/dashboard`);
            }
        }
    }, [navigate]);
    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="logo-text">NeuroFleetX</div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#platform">Platform</a>
                    <Link to="/login" className="btn-secondary">Log In</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="badge">AI-Powered Mobility</div>
                    <h1>Next-Gen Urban <span className="text-gradient">Fleet Optimization</span></h1>
                    <p>
                        Revolutionizing urban transport with real-time AI tracking,
                        predictive maintenance, and intelligent route orchestration.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-primary btn-large">
                            Launch My Fleet <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn-outline btn-large">
                            View Demo
                        </Link>
                    </div>
                </motion.div>
                <div className="hero-visual">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="floating-card c1"
                    >
                        <Activity size={24} color="var(--primary)" />
                        <div>
                            <h4>98.4% Efficiency</h4>
                            <p>AI Optimized</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="floating-card c2"
                    >
                        <Map size={24} color="var(--secondary)" />
                        <div>
                            <h4>Smart Routing</h4>
                            <p>Real-time Traffic</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="floating-card c3" style={{ bottom: '0', right: '0', width: '320px', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={18} color="var(--primary)" />
                            <h4 style={{ fontSize: '0.8rem' }}>AI MISSION PROMPT v4.2</h4>
                        </div>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            "Analyzing 17+ variables including Traffic Density, Weather Shifts, Peak Hours, Vehicle Health, and Passenger Load Weight..."
                        </p>
                        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', width: '100%' }}>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Traffic Density</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Peak Hour Sync</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Road Type AI</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Distance Logic</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Weather Matrix</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Load Weight</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Health Status</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>✓ Driver Score</span>
                        </div>
                    </motion.div>
                    {/* Futuristic SVG or Illustration would go here */}
                    <div className="hero-image-placeholder">
                        <div className="neural-orb">
                            <div className="orb-core"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Feature List for SEO and user visibility */}
            <div style={{ padding: '0 80px 80px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.6 }}>OPTIMIZING WITH 20+ NEURO-FACTORS: Historical Trends, Peak Hour Indicators, Charging Availability, Driver Scores, and more.</p>
            </div>

            {/* Stats Bar */}
            <section className="stats-bar">
                <div className="stat-item">
                    <h3>500+</h3>
                    <p>Active Vehicles</p>
                </div>
                <div className="separator"></div>
                <div className="stat-item">
                    <h3>12M</h3>
                    <p>Optimized KMS</p>
                </div>
                <div className="separator"></div>
                <div className="stat-item">
                    <h3>30%</h3>
                    <p>Fuel Saved</p>
                </div>
                <div className="separator"></div>
                <div className="stat-item">
                    <h3>24/7</h3>
                    <p>AI Monitoring</p>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="features-section">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="section-header"
                >
                    <h2>Advanced <span className="text-gradient">Modules</span></h2>
                    <p>Comprehensive tools for modern mobility management</p>
                </motion.div>

                <div className="features-grid">
                    {[
                        { icon: <Shield />, title: 'Auth & Security', desc: 'Role-based access control with JWT encryption for Admin, Manager, and Drivers.' },
                        { icon: <Zap />, title: 'Fleet Telemetry', desc: 'Real-time vehicle health monitoring, battery status, and location tracking.' },
                        { icon: <Map />, title: 'AI Routing', desc: 'Dijkstra-based pathfinding integrated with ML-based traffic prediction.' },
                        { icon: <Activity />, title: 'Predictive Analytics', desc: 'Machine learning models that predict maintenance needs before failures occur.' },
                        { icon: <BarChart3 />, title: 'Operational IQ', desc: 'Deep insights into fleet distribution and urban mobility density heatmaps.' },
                        { icon: <Globe />, title: 'Multi-Modal', desc: 'Support for EVs, shared rides, and complex logistics transport networks.' }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="feature-card"
                        >
                            <div className="icon-box">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="logo-text">NeuroFleetX</div>
                    <p>&copy; 2026 NeuroFleetX AI Dynamics. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
