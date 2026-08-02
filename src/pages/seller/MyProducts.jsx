import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Seller.css';
import { SkeletonBox } from '../../components/common/Skeleton';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    imageFile: null,
    imagePreview: null,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/my-products');
      // Adjust if backend paginates differently
      setProducts(res.data.data || res.data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || res.data || []);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id || !formData.imageFile) {
      return toast.error('Please fill in all required fields and upload an image.');
    }
    
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', formData.price);
      payload.append('category_id', formData.category_id);
      payload.append('image', formData.imageFile);

      const res = await api.post('/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Product added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', description: '', price: '', category_id: '', imageFile: null, imagePreview: null });
      fetchProducts(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="seller-page-container">
      <div className="seller-page-header">
        <div>
          <h1>My Products</h1>
          <p>Manage your store inventory</p>
        </div>
        <button className="seller-primary-btn" onClick={() => setShowAddModal(true)}>
          <FiPlus /> Add New Product
        </button>
      </div>

      <div className="seller-content-card">
        {loading ? (
          <div className="product-list-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="seller-product-card" style={{ padding: '1rem' }}>
                <SkeletonBox height="160px" width="100%" radius="8px" style={{ marginBottom: '1rem' }} />
                <SkeletonBox height="20px" width="80%" radius="4px" style={{ marginBottom: '0.5rem' }} />
                <SkeletonBox height="24px" width="40%" radius="4px" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <FiPackage style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)', marginBottom: '1rem' }} />
            <h3>No products found</h3>
            <p style={{ color: 'var(--neutral-color)' }}>You haven't listed any products yet.</p>
          </div>
        ) : (
          <div className="product-list-grid">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="seller-product-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <div className="spc-image">
                    <img src={product.image} alt={product.name} />
                    <span className={`spc-status ${product.status}`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="spc-details">
                    <div className="spc-title">{product.name}</div>
                    <div className="spc-price">${parseFloat(product.price).toFixed(2)}</div>
                    <div className="spc-actions">
                      <button className="spc-btn delete" onClick={() => handleDelete(product.id)}>
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => !submitting && setShowAddModal(false)}>
            <motion.div 
              className="product-modal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add New Product</h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)} disabled={submitting}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Product Image *</label>
                    <label className="image-upload-area" style={{ padding: formData.imagePreview ? '1rem' : '2rem' }}>
                      <input 
                        type="file" 
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) {
                            setFormData(f => ({
                              ...f,
                              imageFile: file,
                              imagePreview: URL.createObjectURL(file)
                            }));
                          }
                        }}
                      />
                      {formData.imagePreview ? (
                        <img src={formData.imagePreview} alt="Preview" className="image-preview" />
                      ) : (
                        <div>
                          <FiPlus style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--neutral-color)' }} />
                          <p style={{ margin: 0, color: 'var(--neutral-color)' }}>Click to upload image</p>
                        </div>
                      )}
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Product Name *</label>
                    <input 
                      className="form-input" 
                      placeholder="e.g. Netflix Premium 1 Month"
                      value={formData.name}
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select 
                      className="form-input"
                      value={formData.category_id}
                      onChange={e => setFormData(f => ({ ...f, category_id: e.target.value }))}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-input" 
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData(f => ({ ...f, price: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description (Optional)</label>
                    <textarea 
                      className="form-textarea"
                      placeholder="Provide details about what you are selling..."
                      value={formData.description}
                      onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Add Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProducts;
