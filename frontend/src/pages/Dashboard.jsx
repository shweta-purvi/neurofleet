import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Car, Zap, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Icons
const carIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

const pickupIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const dropIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const MapFollower = ({ vehicle, isTracking }) => {
    const map = useMapEvents({});
    useEffect(() => {
        if (isTracking && vehicle && vehicle.latitude) {
            map.setView([vehicle.latitude, vehicle.longitude], 13, { animate: true });
        }
    }, [vehicle, isTracking, map]);
    return null;
};

const LocationSelector = ({ pickup, drop, setPickup, setDrop }) => {
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            try {
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                const nameParts = res.data?.display_name ? res.data.display_name.split(',').slice(0, 3) : null;
                const name = nameParts ? nameParts.join(',') : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                
                if (!pickup) setPickup({ coords: [lat, lng], name });
                else if (!drop) setDrop({ coords: [lat, lng], name });
                else { setPickup({ coords: [lat, lng], name }); setDrop(null); }
            } catch (error) {
                const name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                if (!pickup) setPickup({ coords: [lat, lng], name });
                else if (!drop) setDrop({ coords: [lat, lng], name });
                else { setPickup({ coords: [lat, lng], name }); setDrop(null); }
            }
        },
    });
    return null;
};

const Dashboard = ({ title }) => {
    const { user } = useAuth();
    const allFactors = [
        'Current Traffic Density', 'Historical Traffic Data', 'Road Type Impact',
        'Distance to Destination', 'Weather Conditions', 'Peak Hour Status',
        'Accident / Roadblock Data', 'Vehicle Speed Tracking', 'Fuel / Battery Levels',
        'Vehicle Health Status', 'Load Weight / Passenger Count', 'Driver Performance Score',
        'Idle Time Monitoring', 'Trip Start Time Sync', 'Pickup–Drop Coordinates',
        'EV Charging Availability', 'Past Delivery Records'
    ];

    const [stats, setStats] = useState({
        vehicles: 0,
        activeBookings: 0,
        alerts: 0
    });

    const [activeFactors, setActiveFactors] = useState(() => {
        const saved = localStorage.getItem('neuro_ai_factors');
        return saved ? JSON.parse(saved) : allFactors;
    });

    const [insightStatus, setInsightStatus] = useState('pending'); // pending, approving, approved, dismissed, generating
    const [currentInsight, setCurrentInsight] = useState("Current traffic density in the downtown sector suggests a 12% increase in travel demand over the next 2 hours. Rerouting 4 available EVs to Hub Alpha for preemptive coverage.");

    // Route Planning State
    const [vehiclesData, setVehiclesData] = useState([]);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [dropLocation, setDropLocation] = useState(null);
    const [nearbyVehicles, setNearbyVehicles] = useState([]);
    const [selectedMapVehicle, setSelectedMapVehicle] = useState(null);
    const [bookingStatus, setBookingStatus] = useState('idle'); // idle, connecting, confirmed
    const [currentBooking, setCurrentBooking] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [manualPickup, setManualPickup] = useState('');
    const [manualDrop, setManualDrop] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleManualAddress = async (type) => {
        const address = type === 'pickup' ? manualPickup : manualDrop;
        if (!address) return;
        try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            if (res.data && res.data.length > 0) {
                const item = res.data[0];
                const name = item.display_name.split(',').slice(0, 2).join(',');
                const loc = { coords: [parseFloat(item.lat), parseFloat(item.lon)], name };
                if (type === 'pickup') {
                    setPickupLocation(loc);
                    setManualPickup('');
                } else {
                    setDropLocation(loc);
                    setManualDrop('');
                }
            }
        } catch (err) {
            console.error('Manual address lookup failed:', err);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !currentBooking) return;
        const msgText = newMessage;
        setNewMessage('');
        
        try {
            const token = localStorage.getItem('neuro_token');
            const bookingId = currentBooking.id || (currentBooking.data && currentBooking.data.id);
            if (!bookingId) return;

            await axios.post(`http://localhost:8080/api/v1/messages/${bookingId}`, {
                text: msgText,
                sender: 'user'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages();
        } catch (error) {
            console.error('Failed to send message to backend:', error);
            setMessages(prev => [...prev, { text: msgText, sender: 'user', timestamp: new Date().toISOString() }]);
        }
    };

    const fetchMessages = async () => {
        const bookingId = currentBooking?.id || (currentBooking?.data && currentBooking?.data.id);
        if (!bookingId) return;
        try {
            const token = localStorage.getItem('neuro_token');
            const res = await axios.get(`http://localhost:8080/api/v1/messages/${bookingId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSelectVehicle = (vehicle) => {
        setSelectedMapVehicle(vehicle);
        setBookingStatus('idle'); // prompt for connection
    };

    const handleConfirmBooking = async () => {
        setBookingStatus('connecting');
        
        // Reset message state for new booking
        setMessages([]);
        setCurrentBooking(null);
        
        // Wait 2 seconds to simulate driver connection
        setTimeout(async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                if (token && selectedMapVehicle.id) {
                    const res = await axios.post('http://localhost:8080/api/v1/bookings', {
                        vehicle: { id: selectedMapVehicle.id.toString().startsWith('m') ? 1 : selectedMapVehicle.id },
                        bookingTime: new Date().toISOString(),
                        status: 'CONFIRMED',
                        estimatedFare: 45.0,
                        pickupLat: pickupLocation.coords[0],
                        pickupLng: pickupLocation.coords[1],
                        dropLat: dropLocation ? dropLocation.coords[0] : null,
                        dropLng: dropLocation ? dropLocation.coords[1] : null
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setCurrentBooking(res.data);
                }
            } catch (error) {
                console.error('Map booking api failed, ignoring for demo.', error);
            }
            
            setBookingStatus('confirmed');
        }, 2000);
    };

    const handleCancelSelection = () => {
        setSelectedMapVehicle(null);
        setBookingStatus('idle');
    };

    useEffect(() => {
        if (pickupLocation) {
            let available = [];
            if (vehiclesData && vehiclesData.length > 0) {
                available = vehiclesData.filter(v => v.status === 'AVAILABLE' || (selectedMapVehicle && v.id === selectedMapVehicle.id));
            }
            
            // If API didn't return available vehicles, generate some mock ones around the pickup location
            if (available.length === 0) {
                const lat = pickupLocation.coords[0];
                const lng = pickupLocation.coords[1];
                available = [
                    { id: 'm1', model: 'Tesla Model S Plaid', licensePlate: 'EV-8842', batteryPercentage: 92, status: 'AVAILABLE', latitude: lat + 0.005, longitude: lng + 0.005 },
                    { id: 'm2', model: 'Rivian R1T', licensePlate: 'EV-3921', batteryPercentage: 85, status: 'AVAILABLE', latitude: lat - 0.003, longitude: lng + 0.008 },
                    { id: 'm3', model: 'Porsche Taycan', licensePlate: 'EV-9993', batteryPercentage: 78, status: 'AVAILABLE', latitude: lat + 0.007, longitude: lng - 0.004 }
                ];
            }
            setNearbyVehicles(available);
        } else {
            setNearbyVehicles([]);
        }
    }, [pickupLocation, dropLocation, vehiclesData]);

    const toggleFactor = (factor) => {
        let newFactors;
        if (activeFactors.includes(factor)) {
            newFactors = activeFactors.filter(f => f !== factor);
        } else {
            newFactors = [...activeFactors, factor];
        }
        setActiveFactors(newFactors);
        localStorage.setItem('neuro_ai_factors', JSON.stringify(newFactors));
    };

    const handleApprove = async () => {
        setInsightStatus('approving');
        try {
            const token = localStorage.getItem('neuro_token');
            await axios.post('http://localhost:8080/api/v1/ai/insight/action',
                { action: 'APPROVE', insight: currentInsight },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setInsightStatus('approved');
            setTimeout(() => {
                generateNewInsight();
            }, 2000);
        } catch (error) {
            console.error('Failed to log approve action:', error);
            setInsightStatus('pending'); // revert on error
        }
    };

    const handleDismiss = async () => {
        setInsightStatus('dismissed');
        try {
            const token = localStorage.getItem('neuro_token');
            await axios.post('http://localhost:8080/api/v1/ai/insight/action',
                { action: 'DISMISS', insight: currentInsight },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTimeout(() => {
                generateNewInsight();
            }, 1500);
        } catch (error) {
            console.error('Failed to log dismiss action:', error);
            setInsightStatus('pending');
        }
    };

    const generateNewInsight = async () => {
        setInsightStatus('generating');
        try {
            const token = localStorage.getItem('neuro_token');
            const res = await axios.get(`http://localhost:8080/api/v1/ai/insight/generate?activeFactors=${activeFactors.join(',')}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTimeout(() => {
                setCurrentInsight(res.data.insight);
                setInsightStatus('pending');
            }, 1000); // Small artificial delay so the user sees the spinner for a moment
        } catch (error) {
            console.error('Failed to fetch new insight:', error);
            // Fallback just in case
            setTimeout(() => {
                setInsightStatus('pending');
            }, 1000);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const vehiclesRes = await axios.get('http://localhost:8080/api/v1/vehicles', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setVehiclesData(vehiclesRes.data);

                setStats(prev => ({
                    ...prev,
                    vehicles: vehiclesRes.data.length,
                    alerts: vehiclesRes.data.filter(v => v.status === 'CRITICAL').length
                }));
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };

        fetchDashboardData();
        
        // Poll more frequently if a booking is confirmed to see live movement
        const interval = setInterval(fetchDashboardData, bookingStatus === 'confirmed' ? 3000 : 10000);
        return () => clearInterval(interval);
    }, [bookingStatus]);

    useEffect(() => {
        if (bookingStatus === 'confirmed' && currentBooking) {
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [bookingStatus, currentBooking]);

    return (
        <div className="main-content">
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{title}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Adaptive Intelligence Status: <span style={{ color: 'var(--success)', fontWeight: 600 }}>Optimal</span></p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Local Node</p>
                        <p style={{ fontWeight: 700 }}>NEURO-SEA-01</p>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid" style={{ padding: 0 }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fleet Capacity</p>
                        <Car size={20} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.vehicles}</h2>
                    <p style={{ color: 'var(--success)', fontSize: '0.75rem', marginTop: '8px' }}>Available across 12 hubs</p>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Load</p>
                        <Activity size={20} color="var(--secondary)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.activeBookings}</h2>
                    <p style={{ color: 'var(--primary)', fontSize: '0.75rem', marginTop: '8px' }}>Peak efficiency reached</p>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Neuro Protection</p>
                        <ShieldCheck size={20} color="var(--success)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>99%</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>Encryption layer active</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '40px' }}>
                <div className="glass-card" style={{ maxWidth: 'none' }}>
                    <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Zap size={20} color="var(--warning)" /> System Pulse
                    </h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                        {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${h}%`,
                                background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                                borderRadius: '4px',
                                opacity: 0.7 + (h / 300)
                            }}></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>24:00</span>
                    </div>
                </div>

                <div className="glass-card" style={{ maxWidth: 'none' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={20} color="var(--primary)" /> AI Model Insight
                        {insightStatus === 'approved' && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--success)', padding: '4px 8px', background: 'rgba(16,185,129,0.1)', borderRadius: '4px' }}>Action Applied</span>}
                        {insightStatus === 'dismissed' && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>Insight Dismissed</span>}
                    </h3>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {insightStatus === 'generating' ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                <div className="spinner" style={{ margin: '0 auto 10px', width: '24px', height: '24px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                <p style={{ fontSize: '0.8rem' }}>Analyzing neuro-factors...</p>
                                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : (
                            <>
                                <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-main)', fontStyle: 'italic', transition: 'all 0.3s', opacity: (insightStatus === 'approving' || insightStatus === 'approved' || insightStatus === 'dismissed') ? 0.5 : 1 }}>
                                    "{currentInsight}"
                                </p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', transition: 'all 0.3s', opacity: (insightStatus === 'pending') ? 1 : 0.5, pointerEvents: (insightStatus === 'pending') ? 'auto' : 'none' }}>
                                    <button onClick={handleApprove} className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {insightStatus === 'approving' ? 'APPROVING...' : 'APPROVE'}
                                    </button>
                                    <button onClick={handleDismiss} className="btn-outline" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.7rem' }}>DISMISS</button>
                                </div>
                            </>
                        )}
                    </div>
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h4 style={{ fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '1px' }}>LIVE AI PREDICTION FACTORS</h4>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Click to toggle</span>
                        </div>
                        {allFactors.map((factor, i) => {
                            const isActive = activeFactors.includes(factor);
                            return (
                                <div
                                    key={i}
                                    onClick={() => toggleFactor(factor)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '0.7rem',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        paddingBottom: '4px',
                                        cursor: 'pointer',
                                        opacity: isActive ? 1 : 0.5,
                                        transition: 'all 0.2s'
                                    }}>
                                    <span style={{ color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}>{factor}</span>
                                    {isActive ? (
                                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ ACTIVE</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)' }}>○ DISABLED</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Plan Route & Find Vehicles Section */}
            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
                <div className="glass-card" style={{ maxWidth: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '8px' }}>
                        <Navigation size={22} color="var(--primary)" />
                        Find Vehicles & Plan Route
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                        Select locations on the map to find nearby units and plan the trajectory. 1st click: Pickup, 2nd click: Dropoff.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Pickup Location</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <MapPin size={16} color="var(--primary)" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {pickupLocation ? pickupLocation.name : 'Select on map or type'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    style={{ padding: '6px 10px', fontSize: '0.75rem' }} 
                                    placeholder="Enter pickup address..." 
                                    value={manualPickup}
                                    onChange={(e) => setManualPickup(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleManualAddress('pickup')}
                                />
                                <button onClick={() => handleManualAddress('pickup')} className="btn-primary" style={{ padding: '6px' }}>SET</button>
                            </div>
                        </div>
                        
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Drop Location</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <MapPin size={16} color="var(--secondary)" />
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                                    {dropLocation ? dropLocation.name : 'Select on map or type'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    style={{ padding: '6px 10px', fontSize: '0.75rem' }} 
                                    placeholder="Enter drop address..." 
                                    value={manualDrop}
                                    onChange={(e) => setManualDrop(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleManualAddress('drop')}
                                />
                                <button onClick={() => handleManualAddress('drop')} className="btn-primary" style={{ padding: '6px' }}>SET</button>
                            </div>
                        </div>
                    </div>

                    {pickupLocation && (
                        <div style={{ marginTop: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {!selectedMapVehicle ? (
                                <>
                                    <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--success)' }}>
                                        Available Nearby Vehicles ({nearbyVehicles.length})
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                                        {nearbyVehicles.map(v => (
                                            <div key={v.id} style={{ padding: '10px', background: 'var(--glass)', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{v.model}</p>
                                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{v.licensePlate} • Bat: {v.batteryPercentage}%</p>
                                                </div>
                                                <button onClick={() => handleSelectVehicle(v)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>
                                                    Select
                                                </button>
                                            </div>
                                        ))}
                                        {nearbyVehicles.length === 0 && (
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No vehicles available nearby.</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div style={{ padding: '16px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--primary)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    {bookingStatus === 'idle' && (
                                        <>
                                            <h4 style={{ fontSize: '1rem', marginBottom: '8px', fontWeight: 700, color: 'var(--text-main)' }}>Confirm Selection</h4>
                                            <p style={{ fontSize: '0.8rem', marginBottom: '4px' }}><strong>Target:</strong> {selectedMapVehicle.model} ({selectedMapVehicle.licensePlate})</p>
                                            {dropLocation && <p style={{ fontSize: '0.8rem', marginBottom: '16px' }}><strong>Route:</strong> {pickupLocation.name.split(',')[0]} ➝ {dropLocation.name.split(',')[0]}</p>}
                                            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                                <button onClick={handleConfirmBooking} className="btn-primary" style={{ flex: 1, fontSize: '0.8rem', padding: '10px' }}>Dispatch Request</button>
                                                <button onClick={handleCancelSelection} className="btn-outline" style={{ fontSize: '0.8rem', padding: '10px' }}>Cancel</button>
                                            </div>
                                        </>
                                    )}

                                    {bookingStatus === 'connecting' && (
                                        <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                                            <div className="spinner" style={{ margin: '0 auto 16px', width: '32px', height: '32px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Establishing Connection...</h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Pinging vehicle & assigned driver...</p>
                                        </div>
                                    )}

                                    {bookingStatus === 'confirmed' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                                <ShieldCheck size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                                                <h4 style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 700 }}>Vehicle En Route</h4>
                                            </div>
                                            
                                            {/* Messaging Section */}
                                            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '12px' }}>
                                                <div id="chat-box" style={{ flex: 1, overflowY: 'auto', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px' }}>
                                                    {messages.map((m, i) => (
                                                        <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '8px', maxWidth: '85%' }}>
                                                            <p style={{ fontSize: '0.75rem', color: m.sender === 'user' ? '#000' : '#fff' }}>{m.text}</p>
                                                            <span style={{ fontSize: '0.6rem', opacity: 0.6, display: 'block', textAlign: 'right' }}>{m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                                        </div>
                                                    ))}
                                                    {messages.length === 0 && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>No messages yet. Say hi to your driver!</p>}
                                                    <div ref={chatEndRef} />
                                                </div>
                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <input 
                                                        type="text" 
                                                        className="input-field" 
                                                        placeholder="Message driver..." 
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                                    />
                                                    <button onClick={handleSendMessage} className="btn-primary" style={{ padding: '6px 12px', width: 'auto' }}>Send</button>
                                                </div>
                                            </div>

                                            <button onClick={handleCancelSelection} className="btn-outline" style={{ width: '100%', fontSize: '0.75rem', padding: '6px' }}>Cancel Trip</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="glass-card" style={{ height: '500px', padding: 0, overflow: 'hidden', position: 'relative' }}>
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CARTO'
                        />
                        <LocationSelector pickup={pickupLocation} drop={dropLocation} setPickup={setPickupLocation} setDrop={setDropLocation} />
                        <MapFollower vehicle={selectedMapVehicle ? vehiclesData.find(v => v.id === selectedMapVehicle.id) || selectedMapVehicle : null} isTracking={bookingStatus === 'confirmed'} />
                        
                        {pickupLocation && (
                            <Marker position={pickupLocation.coords} icon={pickupIcon}>
                                <Popup><strong>Pickup Area</strong></Popup>
                            </Marker>
                        )}
                        {dropLocation && (
                            <Marker position={dropLocation.coords} icon={dropIcon}>
                                <Popup><strong>Dropoff Area</strong></Popup>
                            </Marker>
                        )}

                        {pickupLocation && dropLocation && (
                            <Polyline
                                positions={[pickupLocation.coords, dropLocation.coords]}
                                color="var(--primary)"
                                weight={3}
                                dashArray="10, 10"
                            />
                        )}

                        {/* Show available vehicles on the map */}
                        {nearbyVehicles.map(v => (
                            <Marker 
                                key={v.id} 
                                position={[v.latitude || (pickupLocation ? pickupLocation.coords[0] + (Math.random()*0.02 - 0.01) : 20.5937), v.longitude || (pickupLocation ? pickupLocation.coords[1] + (Math.random()*0.02 - 0.01) : 78.9629)]}
                                icon={carIcon}
                                eventHandlers={{
                                    click: () => handleSelectVehicle(v)
                                }}
                            >
                                <Popup>
                                    <div style={{ color: '#000' }}>
                                        <strong>{v.model}</strong><br />
                                        Plate: {v.licensePlate}<br />
                                        Battery: {v.batteryPercentage}%
                                        <button onClick={() => handleSelectVehicle(v)} className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '4px', fontSize: '0.7rem' }}>Select</button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
