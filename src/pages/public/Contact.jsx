import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMessageSquare, FiSend, FiClock, FiHelpCircle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you! Your ticket has been submitted to support.');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const faqs = [
    {
      q: 'How does ANX Escrow protection work?',
      a: 'When you purchase a game account, your payment is safely held in escrow. The seller cannot withdraw funds until you receive and verify the account credentials.'
    },
    {
      q: 'How long does automated delivery take?',
      a: 'Listings marked with Instant Delivery automatically dispatch credentials to your dashboard within 5 to 10 seconds after payment confirmation.'
    },
    {
      q: 'What if the account credentials do not work?',
      a: 'If credentials are invalid or incorrect, click "Report Issue" in your orders tab within 24 hours. Our support team will inspect the escrow vault and issue a full refund.'
    },
    {
      q: 'How can I become a verified seller on ANX Marketplace?',
      a: 'Click "Become a Seller" in your profile menu, fill in your seller details and proof of game inventory, and our team will review your application within 24 hours.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <motion.div
          className="contact-hero-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>We&apos;re Here to Help 24/7</h1>
          <p>Have questions about your order, seller verification, or escrow safety? Reach out anytime!</p>
        </motion.div>
      </section>

      <div className="contact-container">
        {/* Contact Method Cards */}
        <div className="contact-cards-grid">
          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <FiMail />
            </div>
            <h3>Email Support</h3>
            <p>Our support team monitors inquiries 24 hours a day.</p>
            <a href="mailto:support@anxmarketplace.com" className="contact-link">support@anxmarketplace.com</a>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon-wrapper" style={{ color: '#5865F2' }}>
              <FiMessageSquare />
            </div>
            <h3>Live Discord Community</h3>
            <p>Join over 15,000 gamers and live moderators on Discord.</p>
            <a href="https://discord.gg" target="_blank" rel="noreferrer" className="contact-link">Join Discord Server</a>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon-wrapper" style={{ color: '#eab308' }}>
              <FiClock />
            </div>
            <h3>Fast Response SLA</h3>
            <p>Average response time for ticket disputes is under 15 minutes.</p>
            <span className="contact-link" style={{ cursor: 'default' }}>&lt; 15 mins average</span>
          </div>
        </div>

        {/* Contact Form & FAQs Grid */}
        <div className="contact-main-grid">
          {/* Form */}
          <div className="contact-form-panel">
            <h2>Send Us a Message</h2>
            <p className="form-subtitle">Fill out the support ticket form below and our agents will respond promptly.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Mercer"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="contact-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="contact-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Topic / Inquiry Type</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="contact-select"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Dispute">Order & Escrow Dispute</option>
                  <option value="Seller Application">Seller Verification Question</option>
                  <option value="Technical Bug">Technical Support</option>
                </select>
              </div>

              <div className="form-group">
                <label>Your Message *</label>
                <textarea
                  rows={5}
                  placeholder="Describe your question or issue in detail..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="contact-textarea"
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn" disabled={submitting}>
                <FiSend /> {submitting ? 'Sending Ticket...' : 'Submit Support Ticket'}
              </button>
            </form>
          </div>

          {/* FAQs Accordion Panel */}
          <div className="contact-faq-panel">
            <h2><FiHelpCircle style={{ color: '#D5575E' }} /> Frequently Asked Questions</h2>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item">
                  <h4>{faq.q}</h4>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
