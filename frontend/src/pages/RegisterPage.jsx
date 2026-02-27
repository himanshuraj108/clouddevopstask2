import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

function RegisterPage() {
    const { register, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        const res = await register(form.name, form.email, form.password);
        if (res.success) navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.1) 0%, transparent 70%)' }}>
            <div className="glass-card fade-in" style={{ width: '100%', maxWidth: 460, padding: '2.5rem' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⬡</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create account</h1>
                    <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>Join the MERN community</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <div className="form-group">
                        <label className="form-label"><FiUser /> Full Name</label>
                        <input id="reg-name" type="text" name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiMail /> Email</label>
                        <input id="reg-email" type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiLock /> Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="reg-password"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                className="form-input"
                                placeholder="Min. 8 characters"
                                value={form.password}
                                onChange={handleChange}
                                required
                                style={{ paddingRight: '3rem' }}
                            />
                            <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                {showPwd ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label"><FiLock /> Confirm Password</label>
                        <input id="reg-confirm" type="password" name="confirm" className="form-input" placeholder="Repeat password" value={form.confirm} onChange={handleChange} required />
                    </div>
                    <button id="reg-submit" type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
                        {isLoading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Create Account <FiArrowRight /></>}
                    </button>
                </form>

                <p className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
