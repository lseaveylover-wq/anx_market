import { useState, useEffect } from 'react';
import backendDetector from '../../services/demo/backendDetector';

const DemoModeBadge = () => {
  const [isDemoMode, setIsDemoMode] = useState(backendDetector.isDemoMode);

  useEffect(() => {
    const unsubscribe = backendDetector.subscribe((state) => {
      setIsDemoMode(state.isDemoMode);
    });
    return () => unsubscribe();
  }, []);

  if (!isDemoMode) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 99999,
        background: 'rgba(245, 158, 11, 0.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        color: '#f59e0b',
        padding: '0.35rem 0.75rem',
        borderRadius: '50px',
        fontSize: '0.75rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: '#f59e0b',
          boxShadow: '0 0 8px #f59e0b',
          display: 'inline-block'
        }}
      />
      Demo Mode
    </div>
  );
};

export default DemoModeBadge;
