import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Zap, Shield, Map, Activity, BarChart3, Globe } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const rolePath = user.role.toLowerCase();
            navigate(`/${rolePath}/dashboard`);
        }
    }, [user, navigate]);
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
                <div className="hero-content">
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
                </div>
                <div className="hero-visual">
                    <div className="floating-card c1">
                        <Activity size={24} color="var(--primary)" />
                        <div>
                            <h4>98.4% Efficiency</h4>
                            <p>AI Optimized</p>
                        </div>
                    </div>
                    <div className="floating-card c2">
                        <Map size={24} color="var(--secondary)" />
                        <div>
                            <h4>Smart Routing</h4>
                            <p>Real-time Traffic</p>
                        </div>
                    </div>
                    {/* Futuristic SVG or Illustration would go here */}
                    <div className="hero-image-placeholder">
                        <div className="glow-circle"></div>
                    </div>
                </div>
            </header>

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
                <div className="section-header">
                    <h2>Advanced <span className="text-gradient">Modules</span></h2>
                    <p>Comprehensive tools for modern mobility management</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon-box"><Shield /></div>
                        <h3>Auth & Security</h3>
                        <p>Role-based access control with JWT encryption for Admin, Manager, and Drivers.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><Zap /></div>
                        <h3>Fleet Telemetry</h3>
                        <p>Real-time vehicle health monitoring, battery status, and location tracking.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><Map /></div>
                        <h3>AI Routing</h3>
                        <p>Dijkstra-based pathfinding integrated with ML-based traffic prediction.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><Activity /></div>
                        <h3>Predictive Analytics</h3>
                        <p>Machine learning models that predict maintenance needs before failures occur.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><BarChart3 /></div>
                        <h3>Operational IQ</h3>
                        <p>Deep insights into fleet distribution and urban mobility density heatmaps.</p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-box"><Globe /></div>
                        <h3>Multi-Modal</h3>
                        <p>Support for EVs, shared rides, and complex logistics transport networks.</p>
                    </div>
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
