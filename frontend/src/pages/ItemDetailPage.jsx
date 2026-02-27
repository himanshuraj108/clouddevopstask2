import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { FiArrowLeft, FiStar, FiPackage, FiUser, FiTag } from 'react-icons/fi';

function ItemDetailPage() {
    const { id } = useParams();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const { data } = await api.get(`/items/${id}`);
                setItem(data.item);
            } catch {
                navigate('/items');
            }
            setLoading(false);
        };
        fetchItem();
    }, [id, navigate]);

    if (loading) return <div className="loading-screen"><div className="loader" /></div>;
    if (!item) return null;

    return (
        <div style={{ padding: '8rem 0 4rem' }}>
            <div className="container">
                <Link to="/items" className="btn btn-outline btn-sm" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
                    <FiArrowLeft /> Back to Items
                </Link>
                <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
                    {/* Info Card */}
                    <div className="glass-card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{item.category}</span>
                            {item.isPublished && <span className="badge badge-success">Published</span>}
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>{item.title}</h1>
                        <p className="text-muted" style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            {item.description || 'No description provided.'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fcd34d', marginBottom: '1.5rem' }}>
                            {[...Array(5)].map((_, i) => <FiStar key={i} size={16} fill={i < Math.round(item.rating?.average) ? 'currentColor' : 'none'} />)}
                            <span className="text-sm text-muted">({item.rating?.count || 0} reviews)</span>
                        </div>
                        {item.tags?.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                {item.tags.map((tag) => (
                                    <span key={tag} className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}>
                                        <FiTag size={10} /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Purchase Card */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                            ${item.price}
                        </div>
                        <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>
                            <FiPackage style={{ verticalAlign: 'middle' }} /> {item.stock} units available
                        </p>
                        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
                            Add to Cart
                        </button>
                        <button className="btn btn-outline" style={{ width: '100%' }}>
                            Save for Later
                        </button>
                        {item.createdBy && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                                <p className="text-sm text-muted"><FiUser style={{ verticalAlign: 'middle' }} /> Sold by</p>
                                <p style={{ fontWeight: 600, marginTop: '0.25rem' }}>{item.createdBy.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemDetailPage;
