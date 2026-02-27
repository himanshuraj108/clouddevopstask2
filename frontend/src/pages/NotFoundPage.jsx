import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiArrowLeft } from 'react-icons/fi';

function NotFoundPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <div className="fade-in">
                <FiAlertOctagon size={80} style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', opacity: 0.7 }} />
                <h1 style={{ fontSize: '8rem', fontWeight: 900, lineHeight: 1, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
                <p className="text-muted" style={{ marginBottom: '2.5rem', maxWidth: 400 }}>
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary btn-lg"><FiArrowLeft /> Go Home</Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
