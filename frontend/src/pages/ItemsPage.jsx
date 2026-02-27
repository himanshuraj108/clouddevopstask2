import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiSearch, FiPackage, FiStar } from 'react-icons/fi';

const CATEGORIES = ['all', 'electronics', 'clothing', 'food', 'books', 'sports', 'other'];

function ItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page, limit: 9 });
                if (search) params.append('search', search);
                if (category !== 'all') params.append('category', category);
                const { data } = await api.get(`/items?${params}`);
                setItems(data.items || []);
                setTotalPages(data.pages || 1);
            } catch { }
            setLoading(false);
        };
        fetchItems();
    }, [search, category, page]);

    return (
        <div style={{ padding: '7rem 0 4rem' }}>
            <div className="container">
                {/* Header */}
                <div className="page-header" style={{ padding: '0 0 3rem', textAlign: 'left' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Browse <span className="text-gradient">Items</span></h1>
                    <p className="text-muted">Discover items from our community</p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                        <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search items..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`btn ${category === cat ? 'btn-primary' : 'btn-outline'} btn-sm`}
                                onClick={() => { setCategory(cat); setPage(1); }}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items Grid */}
                {loading ? (
                    <div className="loading-screen"><div className="loader" /></div>
                ) : items.length === 0 ? (
                    <div className="text-center" style={{ padding: '5rem 0' }}>
                        <FiPackage size={60} style={{ color: 'var(--color-text-dim)', marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>No items found</h3>
                        <p className="text-muted">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {items.map((item) => (
                            <Link key={item._id} to={`/items/${item._id}`} style={{ textDecoration: 'none' }}>
                                <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                        <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{item.category}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fcd34d', fontSize: '0.8rem' }}>
                                            <FiStar size={12} fill="currentColor" /> {item.rating?.average?.toFixed(1) || '0.0'}
                                        </div>
                                    </div>
                                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>{item.title}</h3>
                                    <p className="text-muted text-sm" style={{ marginBottom: '1rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {item.description || 'No description available.'}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>${item.price}</span>
                                        <span className="text-sm text-muted">In stock: {item.stock}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(p)}>{p}</button>
                        ))}
                        <button className="btn btn-outline btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemsPage;
