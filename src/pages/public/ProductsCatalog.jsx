import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiShield, FiCheckCircle, FiZap, FiLock, FiPlus, FiMinus } from 'react-icons/fi';
import ProductCard from '../../components/common/ProductCard';
import { SkeletonBox } from '../../components/common/Skeleton';
import AuthModal from '../../components/auth/AuthModal';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './ProductsCatalogCustom.css';
const fallbackCatalogCategories = [
  { id: 1, name: 'Valorant' },
  { id: 2, name: 'Mobile Legends' },
  { id: 3, name: 'PUBG Mobile' },
  { id: 4, name: 'Free Fire' },
  { id: 5, name: 'Genshin Impact' },
];

const fallbackCatalogProducts = [
  { id: 1, title: 'Valorant Radiant Account 50+ Skins', price: 120, rating: 4.9, stock: 4 },
  { id: 2, title: 'Mobile Legends Collector Skin Vault', price: 45, rating: 4.8, stock: 10 },
  { id: 3, title: 'PUBG Mobile Glacier M416 Account', price: 180, rating: 5.0, stock: 2 },
  { id: 4, title: 'Genshin Impact C6 Arlecchino Stacked', price: 290, rating: 4.9, stock: 1 },
];

const ProductsCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const raw = data.data || data.categories || (Array.isArray(data) ? data : []);
      const unique = Array.from(new Map(raw.map((cat) => [cat.name, cat])).values());
      if (unique.length > 0) {
        setCategories(unique);
      } else {
        setCategories(fallbackCatalogCategories);
      }
    } catch (err) {
      console.warn('Using fallback catalog categories:', err.message);
      setCategories(fallbackCatalogCategories);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category_id', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await api.get(url);
      const list = data.data || (Array.isArray(data) ? data : []);
      if (list.length > 0) {
        setProducts(list);
      } else {
        setProducts(fallbackCatalogProducts);
      }
    } catch (err) {
      console.warn('Using fallback products data:', err.message);
      setProducts(fallbackCatalogProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleBuyNow = async (product, qty = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSelectedProduct(null);
      setShowAuthModal(true);
      return;
    }

    setBuying(true);
    try {
      // Create order with product_ids array, quantity & payment method
      const { data } = await api.post('/orders', {
        product_ids: [product.id],
        quantity: qty,
        payment_method: 'Bakong KHQR',
      });

      toast.success('Order placed successfully! Redirecting to Escrow vault...');
      setSelectedProduct(null);
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to place order.');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="products-catalog-page">

      <div className="catalog-container">
        {/* Category Tabs - inline styles to bypass Bootstrap button resets */}
        <div style={{ display:'flex', flexDirection:'row', flexWrap:'nowrap', alignItems:'center', gap:'0.6rem', overflowX:'auto', overflowY:'hidden', padding:'0.75rem 0 1.25rem 0', marginBottom:'1.5rem', scrollbarWidth:'none', width:'100%', boxSizing:'border-box' }}>
          {[{ id: 'all', name: 'All Games' }, ...categories].map((cat) => {
            const isActive = String(selectedCategory) === String(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0.5rem 1.15rem',
                  borderRadius: '50px',
                  border: isActive ? '1px solid transparent' : '1px solid rgba(128,128,128,0.3)',
                  background: isActive ? 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)' : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-primary)',
                  fontSize: '0.88rem', fontWeight: 600,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 15px rgba(182,42,45,0.35)' : '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  outline: 'none', boxSizing: 'border-box',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="catalog-grid-header">
          <h2>
            {selectedCategory === 'all'
              ? 'All Listings'
              : categories.find((c) => String(c.id) === String(selectedCategory))?.name || 'Category Listings'}
          </h2>
          <span className="results-count">{products.length} Offers Available</span>
        </div>

        {loading ? (
          <div className="anx-custom-catalog-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="anx-product-card" style={{ padding: '1.25rem', gap: '1rem', pointerEvents: 'none' }}>
                <SkeletonBox width="80%" height="1.2rem" radius="6px" />
                <SkeletonBox width="60%" height="0.9rem" radius="6px" />
                <SkeletonBox width="100%" height="2rem" radius="10px" />
                <SkeletonBox width="100%" height="40px" radius="12px" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="anx-custom-catalog-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={(id) => {
                  const target = products.find((p) => p.id === id);
                  if (target) {
                    setModalQuantity(1);
                    setSelectedProduct(target);
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <FiFilter className="empty-icon" />
            <h3>No Account Listings Found</h3>
            <p>Try searching for another game, rank, or server region.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <motion.div
              className="product-detail-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
                <FiX />
              </button>

              <div className="modal-header">
                <span className="modal-category-badge">{selectedProduct.category?.name || 'Game Account'}</span>
                <h2>{selectedProduct.title}</h2>
              </div>

              <div className="modal-specs-grid">
                <div className="spec-box">
                  <span className="spec-label">Server / Region</span>
                  <span className="spec-value">{selectedProduct.server || 'Global / NA / EU'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Platform</span>
                  <span className="spec-value">{selectedProduct.platform || 'PC / Mobile'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Rank / Level</span>
                  <span className="spec-value">{selectedProduct.rank || selectedProduct.level || 'Unranked / Max'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Skins Count</span>
                  <span className="spec-value">{selectedProduct.skin_count || 0} Skins</span>
                </div>
              </div>

              <div className="modal-description">
                <h4>Description & Account Details</h4>
                <p>{selectedProduct.long_description || selectedProduct.short_description || selectedProduct.description || 'Full account access with changeable email and password.'}</p>
              </div>

              <div className="modal-security-badge">
                <FiShield style={{ fontSize: '1.25rem', color: '#10b981' }} />
                <div>
                  <strong>ANX Escrow Buyer Protection Guaranteed</strong>
                  <p>Funds are held securely. Full refund if credentials do not match listing description.</p>
                </div>
              </div>

              <div className="modal-footer">
                <div className="modal-footer-top">
                  <div className="modal-price-tag">
                    <span className="price-label">Total Amount ({modalQuantity}x)</span>
                    <span className="price-amount" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                      ${(Number(selectedProduct.price) * modalQuantity).toFixed(2)}{' '}
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>USD</span>
                    </span>
                  </div>

                  <div className="quantity-stepper-box" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '0.4rem 0.75rem', borderRadius: '50px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      disabled={modalQuantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span style={{ fontWeight: '700', minWidth: '1.5rem', textAlign: 'center', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{modalQuantity}</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      disabled={modalQuantity >= (selectedProduct.stock || 10)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="modal-buy-btn"
                  onClick={() => handleBuyNow(selectedProduct, modalQuantity)}
                  disabled={buying}
                >
                  <FiZap /> {buying ? 'Processing...' : `Buy Now ($${(Number(selectedProduct.price) * modalQuantity).toFixed(2)})`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default ProductsCatalog;
