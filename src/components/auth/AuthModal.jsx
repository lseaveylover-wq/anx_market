import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Close modal if authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose();
    }
  }, [isAuthenticated, isOpen]);

  // Reset form when mode changes
  useEffect(() => {
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onSubmit = async (data, e) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(data.email, data.password);
        if (result.success) {
          onClose();
        }
      } else {
        const result = await registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.confirmPassword,
        });
        if (result.success) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${import.meta.env.VITE_API_BASE_URL}/auth/google/redirect`;
    window.location.href = googleAuthUrl;
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal-backdrop"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="auth-modal-container"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="modal-close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </motion.button>

            {/* Header - Simplified */}
            <motion.div
              className="modal-header-simple"
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="modal-title-main">
                {mode === 'login'
                  ? 'Login to your ANX Marketplace account'
                  : 'Create your ANX Marketplace account'}
              </h2>
              <p className="modal-subtitle-link">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <a onClick={toggleMode}>
                  {mode === 'login' ? 'Register' : 'Login'}
                </a>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="form-label">Full Name</label>
                    <div className="input-wrapper">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
                        {...register('name', {
                          required: mode === 'register' ? 'Name is required' : false,
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                        })}
                      />
                    </div>
                    {errors.name && (
                      <motion.p
                        className="error-message"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <motion.div
                className="form-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    className="error-message"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div
                className="form-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    className="error-message"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Confirm Password (Register only) */}
              <AnimatePresence mode="wait">
                {mode === 'register' && (
                  <motion.div
                    className="form-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="form-label">Confirm Password</label>
                    <div className="input-wrapper">
                      <FiLock className="input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Confirm your password"
                        {...register('confirmPassword', {
                          required: mode === 'register' ? 'Please confirm your password' : false,
                          validate: (value) =>
                            mode === 'register' && value !== password
                              ? 'Passwords do not match'
                              : true,
                        })}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p
                        className="error-message"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot Password (Login only) */}
              {mode === 'login' && (
                <div className="form-footer">
                  <a href="#" className="forgot-link">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="modal-submit-btn"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  'Loading...'
                ) : mode === 'login' ? (
                  'Login'
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Toggle Mode - Hidden since we moved it to subtitle */}
            <motion.p
              className="modal-footer"
              style={{ display: 'none' }}
              key={`footer-${mode}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" onClick={toggleMode} className="toggle-mode-btn">
                {mode === 'login' ? 'Register' : 'Login'}
              </button>
            </motion.p>

            {/* Divider */}
            <div className="modal-divider-bottom">
              <span>Or {mode === 'login' ? 'login' : 'register'} with</span>
            </div>

            {/* Google Button - Moved to Bottom */}
            <motion.button
              type="button"
              className="modal-google-btn-bottom"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FcGoogle size={24} />
              <span>Continue with Google</span>
            </motion.button>
          </motion.div>

          {/* Background Animation */}
          <div className="modal-bg-effects">
            <motion.div
              className="modal-bg-circle modal-bg-circle-1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="modal-bg-circle modal-bg-circle-2"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
