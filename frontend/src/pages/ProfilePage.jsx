import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiSave, FiShield } from 'react-icons/fi';

function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [form, setForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await api.put(`/users/${user.id}`, form);
            updateUser(data.user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Update failed');
        }
        setSaving(false);
    };

    return (
        <div style={{ padding: '8rem 0 4rem' }}>
            <div className="container" style={{ maxWidth: 640 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    <span className="text-gradient">Profile</span> Settings
                </h1>
                <p className="text-muted" style={{ marginBottom: '2.5rem' }}>Manage your account information.</p>

                {/* Avatar */}
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&size=128`}
                        alt={user?.name}
                        style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--color-primary)', objectFit: 'cover' }}
                    />
                    <div>
                        <h2 style={{ fontWeight: 700 }}>{user?.name}</h2>
                        <p className="text-muted text-sm">{user?.email}</p>
                        <span className="badge badge-primary" style={{ marginTop: '0.5rem', textTransform: 'capitalize' }}>
                            <FiShield size={10} /> {user?.role}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Edit Information</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label"><FiUser /> Full Name</label>
                            <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><FiMail /> Email</label>
                            <input type="email" className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
                            <span className="text-sm text-muted">Email cannot be changed</span>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Avatar URL</label>
                            <input type="url" name="avatar" className="form-input" placeholder="https://..." value={form.avatar} onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <span className="loader" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiSave /> Save Changes</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
