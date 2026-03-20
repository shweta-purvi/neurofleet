import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    Map as MapIcon,
    Activity,
    Calendar,
    Settings,
    LogOut,
    TrendingUp,
    Users,
    Navigation,
    Bell,
    User as UserIcon,
    Shield,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const getMenuItems = () => {
        const common = [
            { name: 'Dashboard', path: `/${user.role.toLowerCase()}/dashboard`, icon: <LayoutDashboard size={20} /> },
            { name: 'Signals', path: '/notifications', icon: <Bell size={20} /> },
        ];

        const admin = [
            { name: 'Fleet Analytics', path: '/admin/analytics', icon: <TrendingUp size={20} /> },
            { name: 'Live Tracking', path: '/admin/tracking', icon: <Navigation size={20} /> },
            { name: 'System Users', path: '/admin/users', icon: <Users size={20} /> },
        ];

        const manager = [
            { name: 'Live Tracking', path: '/manager/tracking', icon: <Navigation size={20} /> },
            { name: 'Fleet Inventory', path: '/manager/fleet', icon: <Car size={20} /> },
            { name: 'Maintenance', path: '/manager/maintenance', icon: <Activity size={20} /> },
        ];

        const driver = [
            { name: 'Active Routes', path: '/driver/routes', icon: <MapIcon size={20} /> },
            { name: 'Schedules', path: '/driver/schedules', icon: <Calendar size={20} /> },
        ];

        const customer = [
            { name: 'Book Vehicle', path: '/customer/booking', icon: <Calendar size={20} /> },
            { name: 'My Trips', path: '/customer/trips', icon: <MapIcon size={20} /> },
        ]

        const footer = [
            { name: 'My Identity', path: '/profile', icon: <UserIcon size={20} /> },
            { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
            { name: 'Help Hub', path: '/support', icon: <HelpCircle size={20} /> },
        ];

        let roleItems = [];
        switch (user.role) {
            case 'ADMIN': roleItems = admin; break;
            case 'FLEET_MANAGER': roleItems = manager; break;
            case 'DRIVER': roleItems = driver; break;
            case 'CUSTOMER': roleItems = customer; break;
            default: break;
        }

        return { main: [...common, ...roleItems], footer };
    };

    const menu = getMenuItems();

    return (
        <aside className="nav-sidebar">
            <Link to="/" className="logo-text" style={{ fontSize: '1.5rem', marginBottom: '40px', textAlign: 'left', textDecoration: 'none', display: 'block' }}>NeuroFleetX</Link>

            <div style={{ marginBottom: '32px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Main Menu</p>
                <nav>
                    {menu.main.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span style={{ marginLeft: '12px' }}>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div style={{ marginBottom: '32px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Configuration</p>
                <nav>
                    {menu.footer.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span style={{ marginLeft: '12px' }}>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div style={{ marginTop: 'auto', position: 'absolute', bottom: '32px', left: '24px', right: '24px' }}>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                    }}>
                        {user.fullName.charAt(0)}
                    </div>
                    <div style={{ marginLeft: '12px', overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role}</p>
                    </div>
                </div>
                <button onClick={logout} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <LogOut size={20} />
                    <span style={{ marginLeft: '12px' }}>Sign Out</span>
                </button>
            </div>

            <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          color: var(--text-muted);
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.2s ease;
          margin-bottom: 4px;
        }
        .sidebar-link:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-main);
        }
        .sidebar-link.active {
          background: rgba(0, 242, 254, 0.1);
          color: var(--primary);
        }
      `}</style>
        </aside>
    );
};

export default Sidebar;
