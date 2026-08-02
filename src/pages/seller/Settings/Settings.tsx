import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { FiSave, FiUser, FiImage, FiCamera, FiUpload, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { sellerApi } from '../../../services/seller.api';
import { useSellerStore } from '../../../store/useSellerStore';
import { useAuth } from '../../../contexts/AuthContext';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

const Settings: React.FC = () => {
  const { fetchUser, user } = useAuth() as { fetchUser: () => void; user: any };
  const { settings, fetchSettings } = useSellerStore();
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm();
  
  // File state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');

  useEffect(() => {
    if (settings) {
      setLogoPreview(settings.store_logo || user?.avatar || '');
      setBannerPreview(settings.store_banner || '');
      reset({
        display_name: settings.display_name || '',
        description:  settings.description  || '',
        country:      settings.country       || '',
        languages:    settings.languages?.join(', ') || '',
      });
    } else {
      fetchSettings();
    }
  }, [settings, user, reset, fetchSettings]);

  // Handle Logo file selection
  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Handle Banner file selection
  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Banner size must be under 8MB');
      return;
    }

    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = () => setBannerPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const saveMutation = useMutation({
    mutationFn: async (formDataValues: any) => {
      const formData = new FormData();
      formData.append('display_name', formDataValues.display_name || '');
      formData.append('description', formDataValues.description || '');
      formData.append('country', formDataValues.country || '');
      formData.append('languages', formDataValues.languages || '');

      if (logoFile) {
        formData.append('store_logo', logoFile);
      }
      if (bannerFile) {
        formData.append('store_banner', bannerFile);
      }

      return sellerApi.updateSettings(formData);
    },
    onSuccess: () => {
      toast.success('Profile picture & store settings saved!');
      setLogoFile(null);
      setBannerFile(null);
      fetchSettings();
      fetchUser?.();
    },
    onError: () => toast.error('Failed to save settings'),
  });

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const section: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
  };

  if (!settings) {
    return (
      <>
        <div className="seller-header" style={{ pointerEvents: 'none' }}>
          <SkeletonBox width="220px" height="2rem" radius="8px" />
        </div>
        <div className="seller-panel" style={{ marginBottom: '1.5rem' }}>
          <div className="seller-panel-header">
            <SkeletonBox width="140px" height="1.25rem" radius="6px" />
          </div>
          <div className="seller-panel-body">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ marginBottom: '1.25rem' }}>
                <SkeletonBox width="100px" height="0.9rem" radius="6px" style={{ marginBottom: '0.5rem' }} />
                <SkeletonBox width="100%" height="48px" radius="12px" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const currentAvatar = logoPreview || settings.store_logo || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.display_name || user?.name || 'Store')}&background=B62A2D&color=fff&size=140`;

  const hasFormChanges = isDirty || !!logoFile || !!bannerFile;

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
          <h1>Store Settings</h1>
          <p className="seller-subtitle">Upload your profile picture, store banner, and manage public information</p>
        </div>
        <div className="seller-header-actions">
          <motion.button
            type="button"
            onClick={handleSubmit(d => saveMutation.mutate(d))}
            className="seller-cta-btn"
            disabled={!hasFormChanges || saveMutation.isPending}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{ opacity: !hasFormChanges ? 0.6 : 1 }}
          >
            <FiSave />
            {saveMutation.isPending ? 'Uploading…' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(d => saveMutation.mutate(d))}>
        <motion.div variants={container} initial="hidden" animate="visible">

          {/* ── Profile Picture Upload ── */}
          <motion.div variants={section} className="seller-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="seller-panel-header">
              <h2 className="seller-panel-title"><FiUser /> Profile Picture & Avatar</h2>
            </div>
            <div className="seller-panel-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Circular Preview Container */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={currentAvatar}
                    alt="Profile Avatar"
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #B62A2D',
                      boxShadow: '0 8px 25px rgba(182, 42, 45, 0.3)',
                    }}
                  />
                  <label
                    htmlFor="avatar-file-input"
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                      border: '3px solid var(--bg-surface)',
                      transition: 'transform 0.2s ease',
                    }}
                    title="Upload new profile picture"
                  >
                    <FiCamera style={{ fontSize: '1.15rem' }} />
                  </label>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoSelect}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Upload Action Details */}
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                    Upload Profile Picture
                  </h3>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Your avatar will be displayed across your store, navbar, buyer chat messages, and reviews.
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <label
                      htmlFor="avatar-file-input"
                      className="seller-cta-btn"
                      style={{ cursor: 'pointer', display: 'inline-flex', padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
                    >
                      <FiUpload /> Choose Photo
                    </label>

                    {logoFile && (
                      <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiCheckCircle /> Photo Selected ({logoFile.name})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Store Banner Upload ── */}
          <motion.div variants={section} className="seller-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="seller-panel-header">
              <h2 className="seller-panel-title"><FiImage /> Store Banner</h2>
            </div>
            <div className="seller-panel-body">
              {/* Banner Preview Area */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '140px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: bannerPreview
                    ? `url(${bannerPreview}) center/cover no-repeat`
                    : 'linear-gradient(135deg, rgba(182, 42, 45, 0.15) 0%, rgba(213, 87, 94, 0.15) 100%)',
                  border: '2px dashed var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                {!bannerPreview && (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                    No store banner uploaded yet
                  </span>
                )}

                <label
                  htmlFor="banner-file-input"
                  className="seller-cta-btn"
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    padding: '0.65rem 1.25rem',
                    fontSize: '0.88rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  <FiUpload /> Upload Store Banner
                </label>
                <input
                  id="banner-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {bannerFile && (
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiCheckCircle /> Banner Selected ({bannerFile.name})
                </span>
              )}
            </div>
          </motion.div>

          {/* ── Public Details ── */}
          <motion.div variants={section} className="seller-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="seller-panel-header">
              <h2 className="seller-panel-title"><FiUser /> Store Information</h2>
            </div>
            <div className="seller-panel-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="seller-form-label">Store Display Name</label>
                  <input
                    className="seller-form-input"
                    placeholder="e.g. Dragon's Hoard Shop"
                    {...register('display_name', { required: 'Required' })}
                  />
                  {errors.display_name && <span style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.25rem', display: 'block' }}>{String(errors.display_name.message)}</span>}
                </div>

                <div>
                  <label className="seller-form-label">Country / Region</label>
                  <input
                    className="seller-form-input"
                    placeholder="e.g. United States"
                    {...register('country')}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="seller-form-label">Store Description</label>
                  <textarea
                    className="seller-form-textarea"
                    rows={4}
                    placeholder="Tell buyers about your store, business hours, specialization..."
                    style={{ resize: 'vertical' }}
                    {...register('description')}
                  />
                </div>

                <div>
                  <label className="seller-form-label">Languages Spoken (comma-separated)</label>
                  <input
                    className="seller-form-input"
                    placeholder="e.g. English, Malay, Chinese"
                    {...register('languages')}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Save Footer ── */}
          <motion.div
            variants={section}
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}
          >
            <motion.button
              type="submit"
              className="seller-cta-btn"
              disabled={!hasFormChanges || saveMutation.isPending}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ opacity: !hasFormChanges ? 0.6 : 1 }}
            >
              <FiSave />
              {saveMutation.isPending ? 'Uploading…' : 'Save Changes'}
            </motion.button>
          </motion.div>

        </motion.div>
      </form>
    </>
  );
};

export default Settings;
