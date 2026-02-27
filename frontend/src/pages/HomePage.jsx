import { Link } from 'react-router-dom';
import { FiArrowRight, FiDatabase, FiCloud, FiBox, FiShield } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const features = [
    { icon: <FiDatabase size={28} />, title: 'MongoDB Database', desc: 'Robust NoSQL database with Mongoose ODM for flexible data management.' },
    { icon: <FiBox size={28} />, title: 'Express + Node.js', desc: 'Fast, scalable REST API with JWT authentication and rate limiting.' },
    { icon: <FiCloud size={28} />, title: 'AWS Cloud Deploy', desc: 'Frontend on S3/CloudFront, backend on ECS Fargate, database on RDS.' },
    { icon: <FiShield size={28} />, title: 'Security First', desc: 'Helmet, CORS, bcrypt hashing, rate limiting, and input validation.' },
];

function HomePage() {
    const { token } = useAuthStore();

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="fade-in" style={{ maxWidth: 700 }}>
                        <div className="badge badge-primary fade-in" style={{ marginBottom: '1.5rem' }}>
                            🚀 Full-Stack MERN on AWS Cloud
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                            Build. Deploy. <br />
                            <span className="text-gradient">Scale on AWS.</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', maxWidth: 560, marginBottom: '2.5rem', lineHeight: 1.8 }}>
                            A production-ready MERN stack application with Docker, CI/CD, and full AWS infrastructure configuration — ECS, EKS, S3, CloudFront, Route 53, and RDS.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            <Link to={token ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
                                {token ? 'Go to Dashboard' : 'Get Started Free'} <FiArrowRight />
                            </Link>
                            <Link to="/items" className="btn btn-outline btn-lg">Browse Items</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section" style={{ background: 'rgba(15,23,42,0.5)' }}>
                <div className="container">
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                            Everything You Need to <span className="text-gradient">Ship Fast</span>
                        </h2>
                        <p className="text-muted">Production-grade MERN architecture from day one.</p>
                    </div>
                    <div className="grid grid-4">
                        {features.map((f, i) => (
                            <div key={i} className={`glass-card fade-in fade-in-delay-${i % 3 + 1}`} style={{ padding: '2rem' }}>
                                <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>{f.icon}</div>
                                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
                                <p className="text-muted text-sm">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container text-center">
                    <div className="glass-card" style={{ padding: '4rem 2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Ready to <span className="text-gradient">Deploy?</span>
                        </h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>
                            Clone the repo, set your AWS credentials, and deploy in minutes.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
                            <Link to="/items" className="btn btn-outline btn-lg">View Demo</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default HomePage;
