import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiSearch,
  FiX,
  FiGlobe,
  FiChevronRight,
  FiCheckCircle,
} from 'react-icons/fi';
import { useRegion } from '../../contexts/RegionContext';
import './RegionSelectPage.css';

const RegionSelectPage = () => {
  const navigate = useNavigate();
  const { regions, selectedRegion, changeRegion } = useRegion();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter regions dynamically as user types (e.g. typing 'c' filters Canada, Cambodia, Chile, China...)
  const filteredRegions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return regions;
    return regions.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.nativeName.toLowerCase().includes(q) ||
        r.currency.toLowerCase().includes(q)
      );
    });
  }, [regions, searchQuery]);

  const handleSelectRegion = (region) => {
    changeRegion(region);
    setTimeout(() => {
      navigate(-1);
    }, 350);
  };

  return (
    <div className="region-select-page">
      {/* Sticky Mobile Header */}
      <div className="rsp-header-bar">
        <motion.button
          className="rsp-back-btn"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          title="Back"
          type="button"
        >
          <FiArrowLeft />
        </motion.button>

        <div className="rsp-header-info">
          <h1 className="rsp-title">Choose Region</h1>
          <span className="rsp-subtitle">
            Current: {selectedRegion.name} ({selectedRegion.symbol})
          </span>
        </div>

        {/* Current Active Flag */}
        <div className="rsp-active-badge">
          <img
            src={selectedRegion.flag}
            alt={selectedRegion.name}
            className="rsp-flag-img circular-flag"
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="rsp-content">
        {/* Search Bar Section */}
        <div className="rsp-search-section">
          <div className="rsp-search-input-wrapper">
            <FiSearch className="rsp-search-icon" />
            <input
              type="text"
              className="rsp-search-input"
              placeholder="Search region or type letter (e.g., C for Canada, Cambodia...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                className="rsp-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* All Regions / Search Results Section */}
        <div className="rsp-list-section">
          <div className="rsp-section-title">
            <FiGlobe className="rsp-section-icon" />
            <span>
              {searchQuery
                ? `Results for "${searchQuery}" (${filteredRegions.length})`
                : 'All Countries & Regions'}
            </span>
          </div>

          <div className="rsp-regions-grid">
            <AnimatePresence mode="popLayout">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => {
                  const isSelected = region.code === selectedRegion.code;
                  return (
                    <motion.div
                      key={region.code}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`rsp-region-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectRegion(region)}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Flag Icon with 50% border radius */}
                      <img
                        src={region.flag}
                        alt={region.name}
                        className="rsp-flag-img-lg circular-flag"
                      />

                      <div className="rsp-region-details">
                        <div className="rsp-region-main">
                          <span className="rsp-country-name">{region.name}</span>
                          <span className="rsp-code-pill">{region.code}</span>
                        </div>
                        <span className="rsp-native-name">
                          {region.nativeName} • {region.continent}
                        </span>
                      </div>

                      <div className="rsp-currency-badge">
                        <span className="rsp-curr-symbol">{region.symbol}</span>
                        <span className="rsp-curr-code">{region.currencyCode}</span>
                      </div>

                      <div className="rsp-action-icon">
                        {isSelected ? (
                          <FiCheckCircle className="rsp-check-filled" />
                        ) : (
                          <FiChevronRight className="rsp-arrow-right" />
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rsp-empty-state"
                >
                  <div className="rsp-empty-icon">🌏</div>
                  <h3>No regions found</h3>
                  <p>No region matches "{searchQuery}". Try typing another letter!</p>
                  <button
                    type="button"
                    className="rsp-reset-btn"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSelectPage;
