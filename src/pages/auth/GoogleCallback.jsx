import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { googleLogin } = useAuth();

  const hasRan = useRef(false);

  useEffect(() => {
    if (hasRan.current) return;
    
    const handleCallback = async () => {
      // Get token and user from URL params (sent by Laravel backend)
      const token = searchParams.get('token');
      const userString = searchParams.get('user');

      if (!token || !userString) {
        toast.error('Authentication failed');
        navigate('/login');
        return;
      }

      hasRan.current = true;

      try {
        const user = JSON.parse(decodeURIComponent(userString));
        
        // Save to auth context
        await googleLogin({ user, token });
        
        // Redirect to home
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to process authentication');
        navigate('/login');
      }
    };

    handleCallback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <LoadingSpinner text="Completing authentication..." size="large" />
    </div>
  );
};

export default GoogleCallback;
