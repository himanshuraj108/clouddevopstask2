import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

function LoginPage() {
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(form.email, form.password);
        if (res.success) navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)' }}>
            <div className="glass-card fade-in" style={{ width: '100%', maxWidth: 440, padding: '2.5rem' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⬡</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome back</h1>
                    <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="form-group">
                        <label className="form-label"><FiMail /> Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label"><FiLock /> Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="login-password"
                                type={showPwd ? 'text' : 'password'}
                                name="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                            >
                                {showPwd ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button id="login-submit" type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
                        {isLoading ? <span className="loader" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <>Sign In <FiArrowRight /></>}
                    </button>
                </form>

                <p className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign up free
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
