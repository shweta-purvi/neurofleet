import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyTrips from './pages/MyTrips';
import FleetInventory from './pages/FleetInventory';
import RouteOptimizer from './pages/RouteOptimizer';
import MaintenanceAnalytics from './pages/MaintenanceAnalytics';
import BookingInterface from './pages/BookingInterface';
import AdminAnalytics from './pages/AdminAnalytics';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import RealTimeTracking from './pages/RealTimeTracking';
import UsersManagement from './pages/UsersManagement';
import Schedules from './pages/Schedules';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import LiveChat from './components/LiveChat';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard title="Admin Intel Command" /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><UsersManagement /></ProtectedRoute>} />
            <Route path="/admin/tracking" element={<ProtectedRoute><RealTimeTracking /></ProtectedRoute>} />

            <Route path="/fleet_manager/dashboard" element={<ProtectedRoute><Dashboard title="Operations Control" /></ProtectedRoute>} />
            <Route path="/manager/fleet" element={<ProtectedRoute><FleetInventory /></ProtectedRoute>} />
            <Route path="/manager/maintenance" element={<ProtectedRoute><MaintenanceAnalytics /></ProtectedRoute>} />
            <Route path="/manager/tracking" element={<ProtectedRoute><RealTimeTracking /></ProtectedRoute>} />

            <Route path="/driver/dashboard" element={<ProtectedRoute><Dashboard title="Driver Hub" /></ProtectedRoute>} />
            <Route path="/driver/routes" element={<ProtectedRoute><RouteOptimizer /></ProtectedRoute>} />
            <Route path="/driver/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />

            <Route path="/customer/dashboard" element={<ProtectedRoute><Dashboard title="NeuroFleet Interface" /></ProtectedRoute>} />
            <Route path="/customer/booking" element={<ProtectedRoute><BookingInterface /></ProtectedRoute>} />
            <Route path="/customer/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />

            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <LiveChat />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
