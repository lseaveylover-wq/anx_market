import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiX, FiTrendingUp, FiFilter, FiPackage, FiZap } from 'react-icons/fi';
import ProductCard from '../../components/common/ProductCard';
import { SkeletonBox } from '../../components/common/Skeleton';
import api from '../../services/api';
import './SearchPage.css';

const POPULAR_SEARCHES = [
  'Valorant',
  'Mobile Legends',
  'GTA V',
  'Genshin Impact',
  'PUBG Mobile',
  'Roblox',
  'Steam',
  'FC 24'
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('anx_recent_searches');
      return saved ? JSON.parse(saved) : ['Valorant', 'Mobile Legends', 'Steam'];
    } catch {
      return ['Valorant', 'Mobile Legends', 'Steam'];
    }
  });

  // Focus search input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    fetchCategories();
  }, []);

  // Sync URL search params
  useEffect(() => {
    const currentQ = searchParams.get('q') || searchParams.get('search') || '';
    if (currentQ !== query) {
      setQuery(currentQ);
    }
  }, [searchParams]);

  // Execute search when query or category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const raw = data.data || data.categories || (Array.isArray(data) ? data : []);
      const unique = Array.from(new Map(raw.map((cat) => [cat.name, cat])).values());
      setCategories(unique);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchSearchResults = async () => {
    // If search query is empty and no specific category filter selected, show no products
    if (!query.trim() && (!selectedCategory || selectedCategory === 'all')) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category_id', selectedCategory);
      }
      if (query.trim()) {
        params.append('search', query.trim());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await api.get(url);
      const list = data.data || (Array.isArray(data) ? data : []);
      setProducts(list);
    } catch (err) {
      console.error('Search query failed', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setSearchParams({ q: query.trim() });
    }
  };

  const handleTagClick = (tagText) => {
    setQuery(tagText);
    saveRecentSearch(tagText);
    setSearchParams({ q: tagText });
  };

  const saveRecentSearch = (searchTerm) => {
    if (!searchTerm) return;
    const updated = [searchTerm, ...recentSearches.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem('anx_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSearchParams({});
    setProducts([]);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="search-page-container">
      {/* Sticky Mobile Search Header */}
      <div className="search-header-bar">
        <button className="search-back-btn" onClick={() => navigate(-1)} title="Back">
          <FiArrowLeft />
        </button>

        <form
          className="sp-search-bar-form"
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-main)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '50px',
            padding: '0.5rem 1rem',
            boxSizing: 'border-box',
            width: '100%',
            position: 'relative',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search game accounts, titles, sellers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              padding: '0 0.5rem 0 0',
              margin: 0,
              fontFamily: 'inherit',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
            }}
          />

          {query ? (
            <button
              type="button"
              onClick={clearQuery}
              title="Clear search"
              style={{
                position: 'static',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '2px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                pointerEvents: 'auto',
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            >
              <FiX style={{ position: 'static', left: 'auto', right: 'auto', transform: 'none', pointerEvents: 'auto' }} />
            </button>
          ) : null}
        </form>
      </div>

      {/* Category Pills Slider */}
      <div className="search-categories-bar">
        <button
          className={`search-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Games
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id || cat.name}
            className={`search-cat-pill ${selectedCategory === (cat.id || cat.name) ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id || cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Popular / Recent Searches when search is empty */}
      {!query.trim() && (!selectedCategory || selectedCategory === 'all') && (
        <div className="search-suggestions-section">
          {recentSearches.length > 0 && (
            <div className="suggestion-group">
              <h3>Recent Searches</h3>
              <div className="suggestion-tags">
                {recentSearches.map((term, index) => (
                  <button key={index} className="suggestion-tag" onClick={() => handleTagClick(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="suggestion-group">
            <h3><FiTrendingUp style={{ color: '#D5575E' }} /> Trending Searches</h3>
            <div className="suggestion-tags">
              {POPULAR_SEARCHES.map((term, index) => (
                <button key={index} className="suggestion-tag trending" onClick={() => handleTagClick(term)}>
                  <FiZap className="tag-icon" /> {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Grid (Only shown when user types or filters) */}
      {(query.trim() || (selectedCategory && selectedCategory !== 'all')) && (
        <div style={{ padding: '1rem 1.25rem 2rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {loading ? 'Searching...' : `Results ${query.trim() ? `for "${query}"` : ''}`}
            </h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
              {loading ? '' : `${products.length} ${products.length === 1 ? 'account' : 'accounts'} found`}
            </span>
          </div>

          {loading ? (
            <div className="anx-custom-catalog-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="anx-shoe-card" style={{ padding: '1rem', pointerEvents: 'none' }}>
                  <SkeletonBox height="160px" radius="12px" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              className="anx-custom-catalog-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="search-empty-state" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div className="empty-icon-circle" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <FiPackage />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>No Accounts Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                We couldn&apos;t find any accounts matching &quot;{query}&quot;. Try checking for typos or searching another game title.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
