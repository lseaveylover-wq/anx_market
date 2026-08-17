import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiEye, FiEyeOff, FiTrash2, FiSearch } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { SkeletonTable } from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Products.css';

const ProductsTableSkeleton = () => (
  <div className="table-container">
    <table className="products-table">
      <thead>
        <tr>
          {['Product', 'Seller', 'Category', 'Price', 'Status', 'Created', 'Actions'].map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i} style={{ pointerEvents: 'none' }}>
            <td>
              <div className="product-cell">
                <SkeletonBox width="50px" height="50px" radius="8px" style={{ flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <SkeletonBox width="140px" height="1rem" radius="6px" />
                  <SkeletonBox width="100px" height="0.8rem" radius="6px" />
                </div>
              </div>
            </td>
            <td><SkeletonBox width="120px" height="0.9rem" radius="6px" /></td>
            <td><SkeletonBox width="100px" height="0.9rem" radius="6px" /></td>
            <td className="price-cell"><SkeletonBox width="70px" height="0.9rem" radius="6px" /></td>
            <td><SkeletonBox width="80px" height="26px" radius="20px" /></td>
            <td><SkeletonBox width="90px" height="0.9rem" radius="6px" /></td>
            <td>
              <div className="action-buttons">
                <SkeletonBox width="34px" height="34px" radius="8px" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      const data = response.data.data || response.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'hidden' : 'available';
    try {
      await api.put(`/admin/products/${productId}/status`, { status: newStatus });
      toast.success(`Product ${newStatus === 'hidden' ? 'hidden' : 'shown'} successfully`);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product status');
    }
  };

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <motion.div
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-header-content">
            <h1 className="admin-title">
              <FiPackage /> Products Management
            </h1>
            <p className="admin-subtitle">Manage all product listings</p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="search-bar-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="search-input-wrapper">
            <FiSearch />
            <input
              type="text"
              placeholder="Search products by title or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </motion.div>

        {/* Products Table */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SkeletonTable rows={8} columns={7} />
          </motion.div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiPackage />
            <p>No products found</p>
          </motion.div>
        ) : (
          <motion.div
            className="table-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Seller</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ backgroundColor: 'rgba(182, 42, 45, 0.05)' }}
                  >
                    <td>
                      <div className="product-cell">
                        {product.image && (
                          <img
                            src={`http://localhost:8000/storage/${product.image}`}
                            alt={product.title}
                            className="product-image"
                          />
                        )}
                        <div>
                          <div className="product-title">{product.title}</div>
                          <div className="product-description">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{product.seller?.name || 'N/A'}</td>
                    <td>{product.category?.name || 'N/A'}</td>
                    <td className="price-cell">${Number(product.price || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${product.status}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>{new Date(product.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <motion.button
                          className="action-icon-btn view"
                          title={product.status === 'available' ? 'Hide Product' : 'Show Product'}
                          onClick={() => handleToggleStatus(product.id, product.status)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {product.status === 'available' ? <FiEyeOff /> : <FiEye />}
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
