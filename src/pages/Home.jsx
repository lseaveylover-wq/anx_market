import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiTrendingUp,
  FiPackage,
  FiShield,
  FiZap,
  FiGift,
  FiCrosshair,
  FiUserCheck,
  FiDollarSign,
  FiAward,
  FiGrid,
  FiLayers,
  FiHeadphones,
  FiCheckCircle,
  FiArrowRight,
  FiChevronRight
} from 'react-icons/fi';
import LottiePlayer from '../components/common/LottiePlayer';
import { SkeletonBox } from '../components/common/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import BecomeSellerModal from '../components/common/BecomeSellerModal';
import Footer from '../components/layouts/Footer';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Home.css';

const getCategoryIcon = (categoryName) => {
  const name = (categoryName || '').toLowerCase();
  if (name.includes('gift') || name.includes('card')) return <FiGift />;
  if (name.includes('account')) return <FiUserCheck />;
  if (name.includes('coin') || name.includes('currency') || name.includes('gold') || name.includes('money')) return <FiDollarSign />;
  if (name.includes('item') || name.includes('skin') || name.includes('chest') || name.includes('vault')) return <FiPackage />;
  if (name.includes('boost') || name.includes('rank')) return <FiZap />;
  if (name.includes('coach')) return <FiAward />;
  if (name.includes('game')) return <FiCrosshair />;
  return <FiGrid />;
};

const defaultCategories = [
  { id: 1, name: 'Accounts', offers: '1,240' },
  { id: 2, name: 'Items & Skins', offers: '850' },
  { id: 3, name: 'Boosting & Ranks', offers: '420' },
  { id: 4, name: 'Gift Cards', offers: '310' },
];

const defaultTrending = [
  { id: 101, title: 'Valorant Radiant Account Full Access', price: 150, rating: 4.9, stock: 5 },
  { id: 102, title: 'Mobile Legends Mythic Glory 1000+ Stars', price: 85, rating: 4.8, stock: 12 },
  { id: 103, title: 'PUBG Mobile Glacier M416 Max Level', price: 210, rating: 5.0, stock: 3 },
  { id: 104, title: 'CS2 Dragon Lore AWP Field Tested', price: 950, rating: 4.9, stock: 1 },
];

const defaultTestimonials = [
  { id: 1, name: 'Alex Johnson', time: '2 hours ago', comment: 'Instant delivery on my Valorant account! Password and email change worked smoothly within 2 minutes.' },
  { id: 2, name: 'Srey Leak', time: '5 hours ago', comment: 'Best marketplace for MLBB skins. Fast transaction via Bakong KHQR, highly recommended!' },
  { id: 3, name: 'David K.', time: '1 day ago', comment: 'Great seller support and escrow protection. Felt 100% safe purchasing here.' },
];

/* ── Category tab skeleton ──────────────────────────────────────────────── */
const SkeletonTab = () => (
  <SkeletonBox
    className="trending-tab"
    width="90px"
    height="40px"
    radius="10px"
    style={{ display: 'inline-block' }}
  />
);

/* ── Trending card skeleton ─────────────────────────────────────────────── */
const SkeletonTrendingCard = () => (
  <div
    className="trending-card"
    style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
  >
    <SkeletonBox width="70%" height="1.1rem" radius="6px" />
    <SkeletonBox width="50%" height="0.85rem" radius="6px" />
  </div>
);

/* ── Testimonial card skeleton ──────────────────────────────────────────── */
const SkeletonTestimonialCard = () => (
  <div className="comment-item-card skeleton" style={{ pointerEvents: 'none' }}>
    <SkeletonBox width="44px" height="44px" radius="50%" style={{ flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <SkeletonBox width="100px" height="14px" radius="4px" />
        <SkeletonBox width="60px" height="12px" radius="4px" />
      </div>
      <SkeletonBox width="92%" height="13px" radius="4px" />
      <SkeletonBox width="65%" height="13px" radius="4px" />
    </div>
  </div>
);

/* ── Comment / Testimonial Row Component (Matching Image 2 Reference) ─── */
const TestimonialItem = ({ testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 80;
  const rawText = testimonial.message || testimonial.comment || 'Great experience and instant delivery!';
  const isLong = rawText.length > maxLength;

  const displayMessage = isExpanded || !isLong
    ? rawText
    : `${rawText.slice(0, maxLength)}...`;

  return (
    <motion.div
      className="comment-item-card"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="comment-avatar">
        {testimonial.avatar ? (
          <img src={testimonial.avatar} alt={testimonial.name} />
        ) : (
          <span>{(testimonial.name || 'U').charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="comment-content">
        <div className="comment-header-row">
          <h4 className="comment-author-name">{testimonial.name}</h4>
          <span className="comment-timestamp">
            {testimonial.created_at || '5 hours ago'}
          </span>
        </div>

        <p className="comment-message-text">
          {displayMessage}
          {isLong && (
            <button
              className="comment-see-more-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'See more'}{' '}
              <FiArrowRight className={`arrow-icon ${isExpanded ? 'expanded' : ''}`} />
            </button>
          )}
        </p>
      </div>
    </motion.div>
  );
};


const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [trendingData, setTrendingData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const { user } = useAuth();
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleCategoryScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    }
  };

  useEffect(() => {
    setIsVisible(true);
    // Parallelize all independent home data requests
    Promise.all([
      fetchCategories(),
      fetchTrendingData(),
      fetchTestimonials()
    ]);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data;
      const catList = data.data || [];
      if (catList.length > 0) {
        setCategories(catList);
        setSelectedCategory(catList[0].id);
      } else {
        setCategories(defaultCategories);
      }
    } catch (error) {
      console.warn('Using fallback categories:', error.message);
      setCategories(defaultCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTrendingData = async () => {
    try {
      const response = await api.get('/products/trending');
      const data = response.data;
      setTrendingData(data.data && data.data.length > 0 ? data.data : defaultTrending);
    } catch (error) {
      console.warn('Using fallback trending data:', error.message);
      setTrendingData(defaultTrending);
    } finally {
      setLoadingTrending(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/testimonials');
      const data = response.data;
      setTestimonials(data.data && data.data.length > 0 ? data.data : defaultTestimonials);
    } catch (error) {
      console.warn('Using fallback testimonials:', error.message);
      setTestimonials(defaultTestimonials);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const features = [
    {
      icon: <FiShield />,
      title: 'Secure Escrow Protection',
      description: 'Your payments are held safely in escrow until delivery is confirmed.',
      color: '#10b981',
    },
    {
      icon: <FiZap />,
      title: 'Instant Automated Delivery',
      description: 'Automated delivery system sends your account credentials immediately.',
      color: '#f59e0b',
    },
    {
      icon: <FiPackage />,
      title: 'Verified Trusted Merchants',
      description: 'Sellers are thoroughly vetted by our team to guarantee safety.',
      color: '#667eea',
    },
    {
      icon: <FiTrendingUp />,
      title: 'Best Competitive Pricing',
      description: 'Compare offers from top sellers to get the absolute best price.',
      color: '#ec4899',
    },
  ];

  const handleBecomeSellerClick = () => {
    if (!user) {
      toast.error('Please login first to become a seller');
      return;
    }
    if (user.role === 'seller') {
      toast.error('You are already a seller');
      return;
    }
    setIsSellerModalOpen(true);
  };

  const handleBrowseAccountsClick = () => {
    document.querySelector('.trending-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            className="hero-badge desktop-only"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            Premium Game Accounts Marketplace
          </motion.div>

          <motion.h1
            className="hero-title desktop-only"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          >
            Buy &amp; Sell Game Accounts
            <br />
            <span className="gradient-text">Safely &amp; Securely</span>
          </motion.h1>

          <motion.p
            className="hero-description desktop-only"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ANX Marketplace is your trusted platform for buying and selling premium game
            accounts. With secure escrow protection and instant delivery.
          </motion.p>

          <motion.div
            className="hero-cta desktop-only"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className="cta-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBrowseAccountsClick}
            >
              Browse Accounts
            </motion.button>

            <motion.button
              className="cta-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBecomeSellerClick}
            >
              Become a Seller
            </motion.button>
          </motion.div>

          {/* Scrollable DB Categories Carousel (4 Columns x 2 Rows Grid) */}
          <div className="hero-categories-container">
            <div className="hero-categories-header">
              <h3>Explore Categories</h3>
            </div>

            <div
              className="hero-categories-scroll"
              ref={scrollRef}
              onScroll={handleCategoryScroll}
            >
              {loadingCategories ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="category-icon-card skeleton">
                    <SkeletonBox width="46px" height="46px" radius="14px" />
                    <SkeletonBox width="54px" height="12px" radius="4px" style={{ marginTop: '6px' }} />
                  </div>
                ))
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <motion.div
                    key={cat.id || cat.name}
                    className="category-icon-card"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/products?category=${cat.id}`)}
                  >
                    <div className="category-icon-badge">
                      {getCategoryIcon(cat.name)}
                    </div>
                    <span className="category-icon-title">{cat.name}</span>
                  </motion.div>
                ))
              ) : (
                [
                  { id: '1', name: 'Accounts', icon: <FiUserCheck /> },
                  { id: '2', name: 'Games', icon: <FiCrosshair /> },
                  { id: '3', name: 'Gift Cards', icon: <FiGift /> },
                  { id: '4', name: 'Game Coins', icon: <FiDollarSign /> },
                  { id: '5', name: 'Items', icon: <FiPackage /> },
                  { id: '6', name: 'Boosting', icon: <FiZap /> },
                  { id: '7', name: 'Coaching', icon: <FiAward /> },
                  { id: '8', name: 'Rewards', icon: <FiShield /> },
                ].map((item) => (
                  <motion.div
                    key={item.id}
                    className="category-icon-card"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/products')}
                  >
                    <div className="category-icon-badge">
                      {item.icon}
                    </div>
                    <span className="category-icon-title">{item.name}</span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Scroll Indicator (matching Image 2) */}
            <div className="scroll-indicator-container">
              <div className="scroll-indicator-track">
                <div
                  className="scroll-indicator-thumb"
                  style={{ left: `${Math.min(Math.max(scrollProgress, 0), 70)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mascot Animation */}
        <motion.div
          className="hero-mascot"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
        >
          <LottiePlayer
            src="/animations/fist-mascot.json"
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>

        {/* Animated Background */}
        <div className="hero-bg">
          <motion.div
            className="hero-bg-circle hero-bg-circle-1"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="hero-bg-circle hero-bg-circle-2"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="hero-bg-circle hero-bg-circle-3"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -180, -360],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </motion.section>

      {/* Popular Categories Section (Image 1 Template Style with Real DB Data) */}
      <motion.section
        className="trending-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="trending-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '1.5rem' }}
        >
          <h2 className="trending-title">Popular Categories</h2>
        </motion.div>

        {/* Scrollable Container with List Cards matching Image 1 Template */}
        <div className="categories-scroll-wrapper">
          <div className="categories-card-box">
            {loadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="category-list-item skeleton" style={{ pointerEvents: 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    <SkeletonBox width="130px" height="16px" radius="4px" />
                    <SkeletonBox width="75px" height="12px" radius="10px" />
                  </div>
                  <SkeletonBox width="16px" height="16px" radius="4px" />
                </div>
              ))
            ) : (categories.length > 0 ? categories : defaultCategories).slice(0, 4).map((item) => (
              <div
                key={item.id || item.name}
                className="category-list-item"
                onClick={() => navigate(`/products?category=${item.id}`)}
              >
                <div className="category-item-content">
                  <h3 className="category-item-title">{item.name}</h3>
                  <span className="category-offers-pill">{item.offers || '1,240 offers'}</span>
                </div>
                <FiChevronRight className="category-item-arrow" />
              </div>
            ))}

            <button
              className="category-card-view-all"
              onClick={() => navigate('/products')}
            >
              View all
            </button>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="features-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="section-title">Why Choose ANX Marketplace?</h2>
          <p className="section-subtitle">
            We provide the safest and most reliable platform for buying and selling game accounts
          </p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
              }}
            >
              <motion.div
                className="feature-icon"
                style={{ background: `${feature.color}20`, color: feature.color }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        className="testimonials-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="testimonials-title">This is what makes us different</h2>
          <p className="testimonials-subtitle">Hear from our customers.</p>
        </motion.div>

        {/* Dynamic key forces re-mount & re-animation when data arrives */}
        <motion.div
          key={loadingTestimonials ? 'testimonials-loading' : `testimonials-loaded-${testimonials.length}`}
          className="testimonials-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {loadingTestimonials ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonTestimonialCard key={i} />)
          ) : testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <TestimonialItem key={testimonial.id} testimonial={testimonial} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p>No testimonials available</p>
            </div>
          )}
        </motion.div>
      </motion.section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <BecomeSellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />
    </div>
  );
};

export default Home;
