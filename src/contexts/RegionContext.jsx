import { createContext, useContext, useState, useEffect } from 'react';
import { REGIONS_DATA, DEFAULT_REGION } from '../data/regionsData';
import toast from 'react-hot-toast';

const RegionContext = createContext(null);

export const RegionProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState(() => {
    try {
      const savedCode = localStorage.getItem('app_region_code');
      if (savedCode) {
        const found = REGIONS_DATA.find((r) => r.code === savedCode);
        if (found) return found;
      }
    } catch (e) {
      console.error('Failed to load region from localStorage', e);
    }
    return DEFAULT_REGION;
  });

  useEffect(() => {
    try {
      if (selectedRegion?.code) {
        localStorage.setItem('app_region_code', selectedRegion.code);
      }
    } catch (e) {
      console.error('Failed to save region to localStorage', e);
    }
  }, [selectedRegion]);

  const changeRegion = (newRegion, silent = false) => {
    if (!newRegion || newRegion.code === selectedRegion.code) return;

    setSelectedRegion(newRegion);

    if (!silent) {
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={newRegion.flag}
            alt={newRegion.name}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <span>Region set to {newRegion.name} ({newRegion.currencyCode})</span>
        </div>,
        {
          duration: 2500,
          id: 'region-change-toast',
        }
      );
    }
  };

  return (
    <RegionContext.Provider
      value={{
        regions: REGIONS_DATA,
        selectedRegion,
        changeRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};

export default RegionContext;
