import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiShield, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { SkeletonBox } from '../../components/common/Skeleton';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './Users.css';

/* ── Users table skeleton ────────────────────────────────────────────────── */
const UsersTableSkeleton = () => (
  <div className="table-container">
    <table className="users-table">
      <thead>
        <tr>
          {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 8 }).map((_, i) => (
          <tr key={i} style={{ pointerEvents: 'none' }}>
            {/* User cell: avatar + name */}
            <td>
              <div className="user-cell">
                <SkeletonBox width="36px" height="36px" radius="50%" style={{ flexShrink: 0 }} />
                <SkeletonBox width="110px" height="0.85rem" radius="6px" />
              </div>
            </td>
            {/* Email */}
            <td><SkeletonBox width="160px" height="0.85rem" radius="6px" /></td>
            {/* Role badge */}
            <td><SkeletonBox width="72px" height="26px" radius="20px" /></td>
            {/* Status */}
            <td><SkeletonBox width="80px" height="26px" radius="20px" /></td>
            {/* Joined */}
            <td><SkeletonBox width="90px" height="0.85rem" radius="6px" /></td>
            {/* Action button */}
            <td><SkeletonBox width="80px" height="34px" radius="10px" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, admin, seller, customer
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('role', filter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await api.get(`/admin/users?${params.toString()}`);
      // Handle both paginated and non-paginated responses
      const data = response.data.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (user) => {
    setSelectedUser(user);
    setNewStatus(user.status === 'active' ? 'inactive' : 'active');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setNewStatus('');
  };

  const handleUpdateStatus = async () => {
    try {
      setProcessing(true);
      await api.put(`/admin/users/${selectedUser.id}/status`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setProcessing(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return { bg: '#B62A2D', text: '#fff' };
      case 'seller': return { bg: '#667eea', text: '#fff' };
      case 'customer': return { bg: '#10b981', text: '#fff' };
      default: return { bg: '#6b7280', text: '#fff' };
    }
  };

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
              <FiUsers /> User Management
            </h1>
            <p className="admin-subtitle">Manage all platform users</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="filters-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="filter-group">
            <label>Role</label>
            <div className="filter-tabs">
              {['all', 'admin', 'seller', 'customer'].map((role) => (
                <button
                  key={role}
                  className={`filter-tab ${filter === role ? 'active' : ''}`}
                  onClick={() => setFilter(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <div className="filter-tabs">
              {['all', 'active', 'inactive'].map((status) => (
                <button
                  key={status}
                  className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        {loading ? (
          <UsersTableSkeleton />
        ) : users.length === 0 ? (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiUsers />
            <p>No users found</p>
          </motion.div>
        ) : (
          <motion.div
            className="table-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roleColor = getRoleBadgeColor(user.role);
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ backgroundColor: 'rgba(182, 42, 45, 0.05)' }}
                    >
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-small">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} />
                            ) : (
                              user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className="role-badge"
                          style={{
                            background: roleColor.bg,
                            color: roleColor.text,
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-indicator ${user.status}`}>
                          {user.status === 'active' ? <FiCheck /> : <FiAlertCircle />}
                          {user.status}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        {user.role !== 'admin' && (
                          <motion.button
                            className={`status-btn ${user.status === 'active' ? 'suspend' : 'activate'}`}
                            onClick={() => openStatusModal(user)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Activate'}
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Status Update Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>
                    <FiShield /> Update User Status
                  </h2>
                  <button className="close-btn" onClick={closeModal}>
                    <FiX />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="user-summary">
                    <div className="user-avatar">
                      {selectedUser?.avatar ? (
                        <img src={selectedUser.avatar} alt={selectedUser.name} />
                      ) : (
                        selectedUser?.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3>{selectedUser?.name}</h3>
                      <p>{selectedUser?.email}</p>
                    </div>
                  </div>

                  <div className="confirmation-message">
                    <FiAlertCircle />
                    <p>
                      Are you sure you want to {newStatus === 'active' ? 'activate' : 'suspend'} this user?
                      {newStatus === 'inactive' && (
                        <span className="warning-text">
                          This will prevent them from accessing the platform.
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="cancel-btn" onClick={closeModal} disabled={processing}>
                    Cancel
                  </button>
                  <button
                    className={`submit-btn ${newStatus === 'active' ? 'activate' : 'suspend'}`}
                    onClick={handleUpdateStatus}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : newStatus === 'active' ? 'Activate' : 'Suspend'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Users;
