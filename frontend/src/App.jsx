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



const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>{children}</div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard title="Admin Intel Command" /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/fleet_manager/dashboard" element={<ProtectedRoute><Dashboard title="Operations Control" /></ProtectedRoute>} />
          <Route path="/manager/fleet" element={<ProtectedRoute><FleetInventory /></ProtectedRoute>} />
          <Route path="/manager/maintenance" element={<ProtectedRoute><MaintenanceAnalytics /></ProtectedRoute>} />
          <Route path="/driver/dashboard" element={<ProtectedRoute><Dashboard title="Driver Hub" /></ProtectedRoute>} />
          <Route path="/driver/routes" element={<ProtectedRoute><RouteOptimizer /></ProtectedRoute>} />
          <Route path="/customer/dashboard" element={<ProtectedRoute><Dashboard title="NeuroFleet Interface" /></ProtectedRoute>} />
          <Route path="/customer/booking" element={<ProtectedRoute><BookingInterface /></ProtectedRoute>} />
          <Route path="/customer/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
