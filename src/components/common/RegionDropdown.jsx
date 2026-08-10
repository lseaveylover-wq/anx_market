import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiSearch, FiCheck, FiGlobe, FiX } from 'react-icons/fi';
import { useRegion } from '../../contexts/RegionContext';
import './RegionDropdown.css';

const RegionDropdown = ({ compact = false }) => {
  const { regions, selectedRegion, changeRegion } = useRegion();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter regions dynamically as user types (e.g. typing 'c' filters Canada, Cambodia, Chile...)
  const filteredRegions = regions.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.nativeName.toLowerCase().includes(q) ||
      r.currency.toLowerCase().includes(q)
    );
  });

  const handleSelect = (region) => {
    changeRegion(region);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`region-dropdown-wrapper ${compact ? 'compact' : ''}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        className={`region-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        title="Select Region"
        type="button"
      >
        <img
          src={selectedRegion.flag}
          alt={selectedRegion.name}
          className="region-flag-img circular-flag"
        />
        {!compact && <span className="region-code-label">{selectedRegion.code}</span>}
        <FiChevronDown className={`region-chevron ${isOpen ? 'open' : ''}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="region-menu-popup"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header / Title */}
            <div className="region-menu-header">
              <div className="region-menu-title">
                <FiGlobe className="region-header-icon" />
                <span>Select Region</span>
              </div>
              <span className="region-count-badge">{filteredRegions.length} available</span>
            </div>

            {/* Search Input Filter */}
            <div className="region-search-box">
              <FiSearch className="region-search-icon" />
              <input
                type="text"
                placeholder="Filter by letter (e.g. C for Canada)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="region-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Region Items List */}
            <div className="region-list-container">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => {
                  const isSelected = region.code === selectedRegion.code;
                  return (
                    <motion.div
                      key={region.code}
                      className={`region-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelect(region)}
                      whileHover={{ x: 4, backgroundColor: 'var(--bg-overlay)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={region.flag}
                        alt={region.name}
                        className="region-flag-img circular-flag"
                      />
                      <div className="region-item-info">
                        <span className="region-item-name">{region.name}</span>
                        <span className="region-item-sub">
                          {region.nativeName} • {region.currencyCode}
                        </span>
                      </div>
                      <span className="region-item-currency">{region.symbol}</span>
                      {isSelected && <FiCheck className="region-check-icon" />}
                    </motion.div>
                  );
                })
              ) : (
                <div className="region-no-results">
                  <p>No region found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegionDropdown;
