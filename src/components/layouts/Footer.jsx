import { Link } from 'react-router-dom';
import LottiePlayer from '../common/LottiePlayer';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <LottiePlayer
            src="/animations/logo.json"
            loop={true}
            style={{ width: 54, height: 54 }}
          />
          <h3 className="footer-brand-title">ANX Marketplace</h3>
          <p className="footer-brand-desc">
            Your trusted marketplace for 100% verified gaming accounts with instant escrow protection.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Marketplace</h4>
            <Link to="/products">Browse Accounts</Link>
            <Link to="/products?category=all">Categories</Link>
            <Link to="/about">Verified Sellers</Link>
          </div>
          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/contact">Help Center</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/contact">Order FAQs</Link>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <Link to="/contact">Terms of Service</Link>
            <Link to="/contact">Privacy Policy</Link>
            <Link to="/contact">Escrow Policy</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ANX Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
