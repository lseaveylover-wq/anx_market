import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiMessageSquare, FiSearch, FiSend, FiUser, FiCheck } from 'react-icons/fi';
import { sellerApi } from '../../../services/seller.api';
import { useAuth } from '../../../contexts/AuthContext';
import { SkeletonBox } from '../../../components/common/Skeleton';
import toast from 'react-hot-toast';
import '../SellerHub.css';

const Messages: React.FC = () => {
  const { user } = useAuth() as { user: any };
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: loadingConversations } = useQuery({
    queryKey: ['sellerConversations'],
    queryFn: () => sellerApi.getConversations()
  });

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['sellerConversation', activeChat?.user?.id],
    queryFn: () => sellerApi.getConversation(activeChat.user.id),
    enabled: !!activeChat?.user?.id,
    refetchInterval: 5000
  });

  const sendMutation = useMutation({
    mutationFn: (text: string) => sellerApi.sendMessage(activeChat.user.id, text),
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['sellerConversation', activeChat.user.id] });
      queryClient.invalidateQueries({ queryKey: ['sellerConversations'] });
    },
    onError: () => toast.error('Failed to send message')
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;
    sendMutation.mutate(messageText);
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
          <h1>Messages & Support</h1>
          <p className="seller-subtitle">Communicate directly with your buyers and answer inquiries</p>
        </div>
      </motion.div>

      {/* Main Chat Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '1.5rem', height: 'calc(100vh - 220px)' }}>
        {/* Contact List */}
        <motion.div
          className="seller-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <div className="seller-panel-header" style={{ padding: '1rem' }}>
            <div className="seller-search-wrapper" style={{ maxWidth: '100%' }}>
              <FiSearch />
              <input
                type="text"
                className="seller-search-input"
                placeholder="Search conversations..."
                style={{ padding: '0.75rem 1rem 0.75rem 2.75rem' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {loadingConversations ? (
              <div style={{ padding: '1rem' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBox key={i} width="100%" height="56px" radius="12px" style={{ marginBottom: '0.5rem' }} />
                ))}
              </div>
            ) : !conversations?.length ? (
              <div className="seller-empty" style={{ padding: '2rem' }}>
                <FiMessageSquare />
                <p>No conversations yet</p>
              </div>
            ) : (
              conversations.map((chat: any) => {
                const isActive = activeChat?.user?.id === chat.user.id;
                return (
                  <motion.div
                    key={chat.user.id}
                    onClick={() => setActiveChat(chat)}
                    whileHover={{ x: 3 }}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      background: isActive ? 'rgba(182, 42, 45, 0.12)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(182, 42, 45, 0.3)' : 'transparent'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={chat.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.user.name)}&background=B62A2D&color=fff`}
                      alt={chat.user.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{chat.user.name}</span>
                        {chat.lastMessage && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            {new Date(chat.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: chat.unreadCount > 0 ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: chat.unreadCount > 0 ? 700 : 400 }}>
                        {chat.lastMessage?.sender_id === user?.id ? 'You: ' : ''}
                        {chat.lastMessage?.message || 'Started a conversation'}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Active Chat Area */}
        <motion.div
          className="seller-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {activeChat ? (
            <>
              {/* Header */}
              <div className="seller-panel-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={activeChat.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.user.name)}&background=B62A2D&color=fff`}
                    alt={activeChat.user.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{activeChat.user.name}</h3>
                    <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 500 }}>Online Buyer</span>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loadingMessages ? (
                  <div style={{ padding: '1rem' }}>
                    <SkeletonBox width="50%" height="40px" radius="12px" style={{ marginBottom: '1rem' }} />
                    <SkeletonBox width="60%" height="40px" radius="12px" style={{ marginLeft: 'auto', marginBottom: '1rem' }} />
                  </div>
                ) : !messages?.length ? (
                  <div className="seller-empty" style={{ margin: 'auto' }}>
                    <FiMessageSquare />
                    <p>Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map((msg: any) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: isMine ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '75%',
                            padding: '0.75rem 1rem',
                            borderRadius: '16px',
                            borderBottomRightRadius: isMine ? '4px' : '16px',
                            borderBottomLeftRadius: isMine ? '16px' : '4px',
                            background: isMine ? 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)' : 'var(--bg-surface)',
                            border: isMine ? 'none' : '1px solid var(--border-color)',
                            color: isMine ? '#fff' : 'var(--text-primary)',
                            fontSize: '0.92rem'
                          }}
                        >
                          <p style={{ margin: 0 }}>{msg.message}</p>
                          <span style={{ fontSize: '0.7rem', display: 'block', textAlign: 'right', marginTop: '4px', opacity: 0.8 }}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="text"
                    className="seller-form-input"
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <motion.button
                    type="submit"
                    className="seller-cta-btn"
                    disabled={sendMutation.isPending || !messageText.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiSend />
                  </motion.button>
                </form>
              </div>
            </>
          ) : (
            <div className="seller-empty" style={{ margin: 'auto' }}>
              <FiMessageSquare style={{ fontSize: '3.5rem' }} />
              <h3>Select a Conversation</h3>
              <p>Choose a buyer conversation on the left to start messaging</p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Messages;
