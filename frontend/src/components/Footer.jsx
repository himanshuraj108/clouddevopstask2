import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <span className="brand-icon">⬡</span>
                    <span className="text-gradient" style={{ fontWeight: 800 }}>MERNStack</span>
                    <p className="footer-desc">Full-stack MERN application deployed on AWS Cloud.</p>
                </div>
                <div className="footer-links-group">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/items">Items</Link>
                    <Link to="/dashboard">Dashboard</Link>
                </div>
                <div className="footer-links-group">
                    <h4>Account</h4>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/profile">Profile</Link>
                </div>
                <div className="footer-links-group">
                    <h4>Tech Stack</h4>
                    <span>MongoDB</span>
                    <span>Express.js</span>
                    <span>React + Vite</span>
                    <span>Node.js</span>
                    <span>AWS ECS / S3</span>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>© {year} MERNStack App. All rights reserved.</p>
                    <div className="social-links">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FiGithub /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FiTwitter /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FiLinkedin /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
