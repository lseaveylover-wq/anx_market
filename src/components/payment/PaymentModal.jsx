import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiShield,
  FiRefreshCw,
  FiAlertTriangle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, order, onSuccess }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [expired, setExpired] = useState(false);
  const [polling, setPolling] = useState(false);

  // Initialize Payment when modal opens
  useEffect(() => {
    if (isOpen && order) {
      initPayment();
    } else {
      setPaymentData(null);
      setExpired(false);
    }
  }, [isOpen, order]);

  // Expiration Countdown Timer for KHQR
  useEffect(() => {
    if (!paymentData || expired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData, expired]);

  // Real-time 3-second backend MD5 verification polling & EventSource SSE stream
  useEffect(() => {
    if (!paymentData || expired || !paymentData.payment_id) return;

    setPolling(true);
    let consecutiveErrors = 0;

    // 3-second MD5 check polling interval (Bakong API recommends 5s; 3s is safe with server-side cache)
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await api.get(`/payments/${paymentData.payment_id}/status`);
        consecutiveErrors = 0; // reset on success
        if (data.status === 'paid') {
          clearInterval(pollInterval);
          toast.success('Bakong KHQR Payment Confirmed!');
          if (onSuccess) onSuccess(data);
          onClose();
        } else if (data.status === 'expired') {
          setExpired(true);
        }
      } catch (err) {
        consecutiveErrors++;
        console.error(`Status poll error (attempt ${consecutiveErrors})`, err);
        // Stop polling after 10 consecutive failures (e.g. server down)
        if (consecutiveErrors >= 10) {
          clearInterval(pollInterval);
          toast.error('Payment verification lost connection. Please refresh.');
        }
      }
    }, 3000); // Check MD5 every 3 seconds (rate-limit safe)

    // Server-Sent Events (SSE) Real-Time Stream Listener
    let eventSource = null;
    try {
      const baseUrl = api.defaults.baseURL || 'http://localhost:8000/api';
      eventSource = new EventSource(`${baseUrl}/payments/${paymentData.payment_id}/stream`);
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'paid') {
            eventSource.close();
            clearInterval(pollInterval);
            toast.success('Bakong KHQR Payment Verified via NBC!');
            if (onSuccess) onSuccess(data);
            onClose();
          } else if (data.status === 'expired') {
            setExpired(true);
          }
        } catch (e) {
          console.error('SSE parse error', e);
        }
      };
    } catch (e) {
      console.warn('SSE connection error, relying on 1s polling');
    }

    return () => {
      clearInterval(pollInterval);
      if (eventSource) eventSource.close();
      setPolling(false);
    };
  }, [paymentData, expired]);

  const initPayment = async () => {
    setLoading(true);
    setExpired(false);
    setTimeLeft(300);
    try {
      const { data } = await api.post('/payments/initialize', {
        order_id: order.id,
        payment_method: 'bakong_khqr',
      });
      setPaymentData(data.data);
    } catch (err) {
      console.error('Payment initialization error', err);
      toast.error(err.response?.data?.message || 'Failed to initialize payment gateway');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQr = async () => {
    if (!paymentData?.payment_id) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/payments/${paymentData.payment_id}/regenerate-qr`);
      setPaymentData(data.data);
      setExpired(false);
      setTimeLeft(300);
      toast.success('New KHQR Code generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to regenerate QR');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <AnimatePresence>
      <div className="payment-modal-overlay" onClick={onClose}>
        <motion.div
          className="payment-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          {/* Header */}
          <div className="payment-modal-header">
            <div>
              <h2>Bakong KHQR Payment</h2>
              <p className="order-ref-text">Order #{order?.order_number || order?.id} • Total: <strong>${Number(order?.total_amount || 0).toFixed(2)} USD</strong></p>
            </div>
            <button className="modal-close-icon" onClick={onClose}>
              <FiX />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="payment-modal-body">
            {loading ? (
              <div className="payment-loading-state">
                <FiRefreshCw className="spin-icon" />
                <p>Generating secure payment session...</p>
              </div>
            ) : (
              /* Bakong KHQR View */
              <div className="khqr-container">
                {expired ? (
                  <div className="khqr-expired-box">
                    <FiAlertTriangle className="expired-icon" />
                    <h3>KHQR Code Expired</h3>
                    <p>This dynamic payment QR code has expired for security.</p>
                    <button className="regenerate-btn" onClick={handleRegenerateQr}>
                      <FiRefreshCw /> Regenerate New KHQR
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="khqr-card-frame">
                      {paymentData?.qr_image_base64 ? (
                        <img
                          src={paymentData.qr_image_base64}
                          alt="Bakong KHQR"
                          className="khqr-qr-image"
                        />
                      ) : (
                        <div className="khqr-placeholder">QR Code Error</div>
                      )}
                    </div>

                    <div className="khqr-timer-bar">
                      <span>Expires in: <strong>{formatTimer(timeLeft)}</strong></span>
                      <span className="live-poll-dot" title="Listening for NBC Bakong payment verification every 3s">
                        <span className="pulse-dot" /> Checking NBC (Every 3s)
                      </span>
                    </div>

                    <div className="khqr-merchant-info">
                      <span>Merchant: <strong>ANX Marketplace</strong></span>
                      <span>Account: <strong>anx_marketplace@acleda</strong></span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer Security Seal */}
          <div className="payment-modal-footer">
            <FiShield style={{ color: '#10b981' }} />
            <span>ANX Escrow Protection • Payment is safely held in escrow until account delivery is confirmed.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
