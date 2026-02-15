import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, Star, ChevronRight, Filter } from 'lucide-react';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('neuro_token');
                const response = await axios.get('http://localhost:8080/api/v1/bookings/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(response.data);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    if (loading) return <div className="main-content">Loading your journeys...</div>;

    return (
        <div className="main-content">
            <header className="page-header" style={{ marginBottom: '40px' }}>
                <div>
                    <h1>My Journeys</h1>
                    <p className="text-muted">Track your mobility history and upcoming schedules</p>
                </div>
                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={18} /> Filter History
                </button>
            </header>

            <div className="trips-grid">
                {trips.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No trips found yet. Start your first journey!</p>
                    </div>
                ) : (
                    trips.map((trip) => (
                        <div key={trip.id} className="glass-card trip-card">
                            <div className="trip-status-header">
                                <span className={`status-badge ${trip.status.toLowerCase()}`}>
                                    {trip.status}
                                </span>
                                <span className="trip-id">#{trip.id}</span>
                            </div>

                            <div className="trip-main">
                                <div className="trip-timeline">
                                    <div className="timeline-point start">
                                        <MapPin size={16} />
                                        <div>
                                            <p className="label">Vehicle</p>
                                            <p className="value">{trip.vehicle.model}</p>
                                        </div>
                                    </div>
                                    <div className="timeline-connector"></div>
                                    <div className="timeline-point end">
                                        <MapPin size={16} />
                                        <div>
                                            <p className="label">License</p>
                                            <p className="value">{trip.vehicle.licensePlate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="trip-details">
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    <span>{new Date(trip.bookingTime).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={16} />
                                    <span>{new Date(trip.bookingTime).toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div className="trip-footer">
                                <div className="price-info" style={{ width: '100%', textAlign: 'right' }}>
                                    <p className="label">Estimated Fare</p>
                                    <p className="value price">${trip.estimatedFare?.toFixed(2) || '0.00'}</p>
                                </div>
                            </div>

                            <button className="btn-text">
                                View Details <ChevronRight size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyTrips;
