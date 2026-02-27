import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { FiPackage, FiUser, FiPlus, FiGrid, FiTrendingUp } from 'react-icons/fi';

function DashboardPage() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ items: 0, users: 0 });
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/items');
                setMyItems(data.items?.slice(0, 6) || []);
                setStats({ items: data.total || 0 });
            } catch { }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="loading-screen">
            <div className="loader" />
            <p className="text-muted">Loading dashboard...</p>
        </div>
    );

    return (
        <div style={{ padding: '8rem 0 4rem' }}>
            <div className="container">
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
                            Welcome, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
                        </h1>
                        <p className="text-muted">Here's your overview for today.</p>
                    </div>
                    <Link to="/items" className="btn btn-primary"><FiPlus /> Add Item</Link>
                </div>

                {/* Stats */}
                <div className="grid grid-4" style={{ marginBottom: '2.5rem' }}>
                    {[
                        { icon: <FiPackage size={22} />, label: 'Total Items', value: stats.items, color: '#6366f1' },
                        { icon: <FiUser size={22} />, label: 'Account', value: user?.role || 'user', color: '#8b5cf6' },
                        { icon: <FiTrendingUp size={22} />, label: 'Status', value: 'Active', color: '#10b981' },
                        { icon: <FiGrid size={22} />, label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024', color: '#06b6d4' },
                    ].map((s, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ color: s.color, marginBottom: '0.75rem' }}>{s.icon}</div>
                            <p className="text-muted text-sm">{s.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize' }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* My Items */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontWeight: 700 }}>Recent Items</h2>
                        <Link to="/items" className="btn btn-outline btn-sm">View All</Link>
                    </div>
                    {myItems.length === 0 ? (
                        <div className="text-center" style={{ padding: '3rem 0' }}>
                            <FiPackage size={48} style={{ color: 'var(--color-text-dim)', marginBottom: '1rem' }} />
                            <p className="text-muted">No items found. Be the first to add one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-3">
                            {myItems.map((item) => (
                                <Link key={item._id} to={`/items/${item._id}`} style={{ textDecoration: 'none' }}>
                                    <div className="glass-card" style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{item.title}</h3>
                                            <span className="badge badge-primary">${item.price}</span>
                                        </div>
                                        <p className="text-muted text-sm" style={{ lineClamp: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {item.description || 'No description'}
                                        </p>
                                        <span className="badge badge-success" style={{ marginTop: '0.75rem' }}>{item.category}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
