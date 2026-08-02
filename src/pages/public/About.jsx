import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiZap, FiUserCheck, FiHeadphones, FiLock, FiAward } from 'react-icons/fi';
import './About.css';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90 }
    }
  };

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="about-subtitle-tag">THE PREMIER GAMING MARKETPLACE</span>
          <h1>Empowering Gamers Worldwide</h1>
          <p>
            ANX Marketplace is built with 100% secure escrow protection, instant automated delivery, and verified sellers to ensure complete peace of mind for every transaction.
          </p>
        </motion.div>
      </section>

      {/* Stats Counter */}
      <section className="about-stats-container">
        <div className="about-stats-grid">
          <div className="about-stat-card">
            <h3>$1.5M+</h3>
            <p>Escrow Volume Handled</p>
          </div>
          <div className="about-stat-card">
            <h3>10,000+</h3>
            <p>Verified Gaming Accounts</p>
          </div>
          <div className="about-stat-card">
            <h3>99.9%</h3>
            <p>Customer Satisfaction</p>
          </div>
          <div className="about-stat-card">
            <h3>&lt; 10 Sec</h3>
            <p>Automated Delivery Time</p>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="about-section">
        <div className="about-section-header">
          <h2>Why Choose ANX Marketplace?</h2>
          <p>Our state-of-the-art security & instant delivery ecosystem</p>
        </div>

        <motion.div
          className="about-pillars-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="pillar-card" variants={itemVariants}>
            <div className="pillar-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <FiShield />
            </div>
            <h3>100% Escrow Security</h3>
            <p>
              Your payment is safely held in encrypted escrow and is only released to the seller once you have verified full account access.
            </p>
          </motion.div>

          <motion.div className="pillar-card" variants={itemVariants}>
            <div className="pillar-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
              <FiZap />
            </div>
            <h3>Instant Automated Delivery</h3>
            <p>
              Our automated credential vault vault delivers login email, password, and 2FA keys directly to your dashboard within seconds.
            </p>
          </motion.div>

          <motion.div className="pillar-card" variants={itemVariants}>
            <div className="pillar-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <FiUserCheck />
            </div>
            <h3>Verified Elite Sellers</h3>
            <p>
              Every seller undergoes strict identity verification and rating audits before listing high-tier gaming accounts on our platform.
            </p>
          </motion.div>

          <motion.div className="pillar-card" variants={itemVariants}>
            <div className="pillar-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <FiHeadphones />
            </div>
            <h3>24/7 Dedicated Support</h3>
            <p>
              Our support team is online round-the-clock to resolve order disputes, account transfers, and technical inquiries immediately.
            </p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
