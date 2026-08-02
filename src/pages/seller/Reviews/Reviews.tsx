import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiStar, FiMessageSquare, FiSend, FiX } from 'react-icons/fi';
import { sellerApi } from '../../../services/seller.api';
import { SkeletonBox } from '../../../components/common/Skeleton';
import toast from 'react-hot-toast';
import '../SellerHub.css';

const StarRating = ({ rating }: { rating: number }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        style={{
          fontSize: '0.9rem',
          color: i < rating ? '#f59e0b' : 'var(--text-secondary)',
          fill: i < rating ? '#f59e0b' : 'none',
          opacity: i < rating ? 1 : 0.3,
        }}
      />
    ))}
  </div>
);

const Reviews: React.FC = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['sellerReviews', page],
    queryFn: () => sellerApi.getReviews({ page }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }: { id: number; reply: string }) =>
      sellerApi.replyToReview(id, reply),
    onSuccess: () => {
      toast.success('Reply posted!');
      queryClient.invalidateQueries({ queryKey: ['sellerReviews'] });
      setActiveReplyId(null);
    },
    onError: () => toast.error('Failed to post reply'),
  });

  const handleReply = (id: number) => {
    if (!replyText[id]?.trim()) { toast.error('Reply cannot be empty'); return; }
    replyMutation.mutate({ id, reply: replyText[id] });
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const cardAnim: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <>
      {/* Header */}
      <motion.div
        className="seller-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="seller-header-content">
          <h1>Customer Reviews</h1>
          <p className="seller-subtitle">Read and reply to your customer feedback</p>
        </div>
      </motion.div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="seller-activity-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="seller-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <SkeletonBox width="40px" height="40px" radius="50%" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <SkeletonBox width="120px" height="0.9rem" radius="6px" />
                  <SkeletonBox width="80px" height="0.75rem" radius="6px" style={{ marginTop: '0.4rem' }} />
                </div>
              </div>
              <SkeletonBox width="100%" height="3rem" radius="8px" />
            </div>
          ))}
        </div>
      ) : !data?.data?.length ? (
        <div className="seller-panel">
          <div className="seller-panel-body">
            <div className="seller-empty">
              <FiStar />
              <p>No reviews yet — keep selling!</p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {data.data.map((review: any) => (
            <motion.div
              key={review.id}
              className="seller-panel"
              variants={cardAnim}
              whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
            >
              {/* Review Header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <img
                  src={review.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'Buyer')}&background=B62A2D&color=fff`}
                  alt={review.user?.name}
                  style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {review.user?.name || 'Anonymous Buyer'}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {review.product && <> · {review.product.title}</>}
                  </span>
                </div>
              </div>

              {/* Review Body */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {review.comment}
                </p>

                {/* Existing Reply */}
                {review.reply && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: '1rem',
                      padding: '1rem 1.25rem',
                      background: 'linear-gradient(135deg, rgba(182,42,45,0.05) 0%, rgba(213,87,94,0.05) 100%)',
                      border: '1px solid rgba(182,42,45,0.15)',
                      borderRadius: '12px',
                      borderLeft: '3px solid #D5575E',
                    }}
                  >
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem', fontWeight: 700, color: '#D5575E' }}>
                      Your Reply
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {review.reply}
                    </p>
                  </motion.div>
                )}

                {/* Reply Button / Form */}
                {!review.reply && (
                  <div style={{ marginTop: '1rem' }}>
                    {activeReplyId !== review.id ? (
                      <motion.button
                        className="seller-action-btn"
                        style={{ width: 'auto', padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => setActiveReplyId(review.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiMessageSquare style={{ color: '#D5575E' }} />
                        Reply to Review
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                      >
                        <textarea
                          className="seller-form-textarea"
                          rows={3}
                          placeholder="Write your reply…"
                          value={replyText[review.id] || ''}
                          onChange={e => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
                          style={{ resize: 'vertical', flex: 1 }}
                          autoFocus
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <motion.button
                            className="seller-cta-btn"
                            style={{ padding: '0.7rem 1rem', fontSize: '0.85rem' }}
                            onClick={() => handleReply(review.id)}
                            disabled={replyMutation.isPending}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                          >
                            <FiSend />
                          </motion.button>
                          <button
                            onClick={() => setActiveReplyId(null)}
                            style={{ padding: '0.7rem', borderRadius: 8, border: '1px solid var(--border-color)', background: 'transparent', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <FiX />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {data?.last_page > 1 && (
        <div className="seller-pagination" style={{ marginTop: '1.5rem' }}>
          <span className="seller-pagination-info">
            Showing {data.from}–{data.to} of {data.total} reviews
          </span>
          <div className="seller-pagination-btns">
            <button className="seller-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Previous
            </button>
            <button className="seller-page-btn" disabled={page === data.last_page} onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
