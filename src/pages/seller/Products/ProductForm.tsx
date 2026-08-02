import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FiArrowLeft, FiSave, FiShield, FiLock, FiInfo, FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { sellerApi } from '../../../services/seller.api';
import api from '../../../services/api';
import { SkeletonBox } from '../../../components/common/Skeleton';
import '../SellerHub.css';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'credentials'>('basic');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  
  const autoDelivery = watch('auto_delivery');
  
  // Fetch categories
  const { data: rawCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data || data.categories || (Array.isArray(data) ? data : []);
    }
  });

  const rawList = Array.isArray(rawCategories) ? rawCategories : Array.isArray(rawCategories?.data) ? rawCategories.data : [];
  const categories = Array.from(new Map(rawList.map((cat: any) => [cat.name, cat])).values());

  // Fetch product if editing
  const { data: productData, isLoading: isFetchingProduct } = useQuery({
    queryKey: ['sellerProduct', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/seller/products/${id}`);
      return data.data || data.product || data;
    },
    enabled: isEditing
  });

  useEffect(() => {
    if (productData) {
      const p = productData;
      reset({
        category_id: p.category_id || p.category?.id || '',
        title: p.title || '',
        price: p.price || 0,
        stock: p.stock || 1,
        discount: p.discount || 0,
        short_description: p.short_description || '',
        long_description: p.long_description || p.description || '',
        status: p.status || 'available',
        auto_delivery: p.auto_delivery ?? true,
        server: p.server || '',
        platform: p.platform || '',
        rank: p.rank || '',
        level: p.level || '',
        character: p.character || '',
        skin_count: p.skin_count || 0,
        item_count: p.item_count || 0,
        credentials: p.credentials || {}
      });
    }
  }, [productData, reset]);

  const saveMutation = useMutation({
    mutationFn: (payload: any) => isEditing ? sellerApi.updateProduct(Number(id), payload) : sellerApi.createProduct(payload),
    onSuccess: () => {
      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate('/seller/products');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || error.response?.data?.details || Object.values(error.response?.data?.errors || {}).flat()[0] || 'Failed to save product');
    }
  });

  const onSubmit = (data: any) => {
    data.category_id = Number(data.category_id);
    data.price = Number(data.price);
    data.stock = Number(data.stock || 1);
    data.discount = Number(data.discount || 0);
    data.description = data.long_description || data.short_description || data.title;
    
    if (data.auto_delivery && !data.credentials?.login_email && !data.credentials?.username) {
      toast.error('Auto delivery requires at least a login email or username in credentials.');
      setActiveTab('credentials');
      return;
    }

    saveMutation.mutate(data);
  };

  if (isEditing && isFetchingProduct) {
    return (
      <>
        <div className="seller-header" style={{ pointerEvents: 'none' }}>
          <SkeletonBox width="260px" height="2rem" radius="8px" />
        </div>
        <div className="seller-panel">
          <div className="seller-panel-body">
            <SkeletonBox width="100%" height="400px" radius="12px" />
          </div>
        </div>
      </>
    );
  }

  const InputField = ({ label, name, type = 'text', required = false, col = 'col-12', placeholder = '' }: any) => (
    <div className={col}>
      <label className="seller-form-label">
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input
        type={type}
        step={type === 'number' ? 'any' : undefined}
        className="seller-form-input"
        placeholder={placeholder}
        {...register(name, { required: required ? 'This field is required' : false })}
      />
      {errors[name] && (
        <span style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.25rem', display: 'block' }}>
          {String(errors[name]?.message)}
        </span>
      )}
    </div>
  );

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
          <button
            type="button"
            onClick={() => navigate('/seller/products')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              padding: 0
            }}
          >
            <FiArrowLeft /> Back to Products
          </button>
          <h1>{isEditing ? 'Edit Product' : 'Create New Product'}</h1>
          <p className="seller-subtitle">Fill in the game details and credentials for secure automated delivery</p>
        </div>
        <div className="seller-header-actions">
          <motion.button
            type="button"
            className="seller-cta-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit(onSubmit)}
            disabled={saveMutation.isPending}
          >
            <FiSave /> {saveMutation.isPending ? 'Saving...' : 'Save Product'}
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'basic', label: 'Basic Info', icon: <FiInfo /> },
          { key: 'details', label: 'Game Details', icon: <FiLayers /> },
          { key: 'credentials', label: 'Credentials & Security', icon: <FiLock /> }
        ].map(t => (
          <motion.button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '20px',
              border: activeTab === t.key ? 'none' : '1px solid var(--border-color)',
              background: activeTab === t.key ? 'linear-gradient(135deg, #B62A2D 0%, #D5575E 100%)' : 'var(--bg-surface)',
              color: activeTab === t.key ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {t.icon}
            {t.label}
          </motion.button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div className="seller-panel" layout>
          <div className="seller-panel-body">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}
                >
                  <div style={{ gridColumn: '1 / -1' }}>
                    <InputField label="Product Title" name="title" required placeholder="e.g. Level 30 Valorant Radiant Smurf Account" />
                  </div>

                  <div>
                    <label className="seller-form-label">Category <span style={{ color: '#ef4444' }}>*</span></label>
                    <select
                      className="seller-form-select"
                      {...register('category_id', { required: true })}
                    >
                      <option value="">Select Game</option>
                      {categories?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <InputField label="Price (USD)" name="price" type="number" required placeholder="0.00" />
                  <InputField label="Stock" name="stock" type="number" placeholder="1" />

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="seller-form-label">Short Summary</label>
                    <input type="text" className="seller-form-input" placeholder="Brief headline highlight..." {...register('short_description')} />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="seller-form-label">Detailed Description</label>
                    <textarea
                      className="seller-form-textarea"
                      rows={4}
                      placeholder="Detailed information about rank, inventory items, characters, etc."
                      {...register('long_description')}
                    />
                  </div>

                  <div>
                    <label className="seller-form-label">Visibility Status</label>
                    <select className="seller-form-select" {...register('status')}>
                      <option value="available">Available (Public)</option>
                      <option value="hidden">Hidden</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}
                >
                  <InputField label="Server / Region" name="server" placeholder="e.g. NA, EUW, Asia, Global" />
                  <InputField label="Platform" name="platform" placeholder="e.g. PC, PS5, Xbox, Mobile" />
                  <InputField label="Rank / Level" name="rank" placeholder="e.g. Immortal 3 / Level 150" />
                  <InputField label="Skin Count" name="skin_count" type="number" placeholder="0" />
                  <InputField label="Featured Character/Main" name="character" placeholder="e.g. Jett, Yasuo, Raiden" />
                  <InputField label="Delivery Time Guarantee" name="delivery_time" placeholder="e.g. 5 minutes or 10 min" />

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input type="checkbox" {...register('auto_delivery')} style={{ width: 18, height: 18, accentColor: '#B62A2D' }} />
                      Automated Delivery
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input type="checkbox" {...register('manual_delivery')} style={{ width: 18, height: 18, accentColor: '#B62A2D' }} />
                      Manual Delivery
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input type="checkbox" {...register('instant_delivery')} style={{ width: 18, height: 18, accentColor: '#B62A2D' }} />
                      Instant Delivery Badge
                    </label>
                  </div>
                </motion.div>
              )}

              {activeTab === 'credentials' && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}
                >
                  <div style={{ gridColumn: '1 / -1', padding: '1rem', background: 'rgba(182, 42, 45, 0.1)', borderRadius: '12px', border: '1px solid rgba(182, 42, 45, 0.3)', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#D5575E', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiShield /> Escrow Encrypted Vault
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Credentials submitted here are encrypted and automatically delivered to the buyer upon successful payment release.
                    </p>
                  </div>

                  <InputField label="Account Login Email / ID" name="credentials.login_email" placeholder="e.g. buyer@example.com" />
                  <InputField label="Username (Optional)" name="credentials.username" placeholder="e.g. GamerTag123" />
                  <InputField label="Password" name="credentials.password" type="password" placeholder="••••••••••••" />
                  <InputField label="2FA Code / Secret Key" name="credentials.two_factor_code" placeholder="e.g. 123456 or Secret Key" />
                  <InputField label="Recovery Email" name="credentials.recovery_email" placeholder="e.g. recovery@gmail.com" />
                  <InputField label="Backup Codes" name="credentials.backup_codes" placeholder="Comma separated backup codes" />

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="seller-form-label">Extra Delivery Instructions</label>
                    <textarea
                      className="seller-form-textarea"
                      rows={3}
                      placeholder="Step-by-step instructions for the buyer to change email, password, etc."
                      {...register('credentials.extra_information')}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </form>
    </>
  );
};

export default ProductForm;
