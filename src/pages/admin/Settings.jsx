import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSettings, FiSave, FiUser, FiGlobe, FiBell,
  FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle,
  FiCheckCircle, FiShield, FiToggleLeft, FiToggleRight, FiCamera
} from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { SkeletonBox } from '../../components/common/Skeleton';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './Settings.css';

/* ─── Skeleton ──────────────────────────────────────────────────────────── */
const SettingsSkeleton = () => (
  <div className="settings-card skeleton-card" style={{ pointerEvents: 'none' }}>
    <div className="card-header">
      <SkeletonBox width="160px" height="1.5rem" radius="6px" />
    </div>
    <div className="card-body">
      <SkeletonBox width="100%" height="3rem" radius="8px" style={{ marginBottom: '1rem' }} />
      <SkeletonBox width="100%" height="3rem" radius="8px" style={{ marginBottom: '1rem' }} />
      <SkeletonBox width="100%" height="3rem" radius="8px" style={{ marginBottom: '1rem' }} />
      <SkeletonBox width="120px" height="2.5rem" radius="8px" />
    </div>
  </div>
);

/* ─── Password field with show/hide toggle ──────────────────────────────── */
const PasswordInput = ({ id, value, onChange, placeholder, disabled }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="password-wrapper">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        className="settings-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="new-password"
      />
      <button
        type="button"
        className="pw-toggle"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

/* ─── Toggle Switch ─────────────────────────────────────────────────────── */
const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    type="button"
    className={`toggle-switch ${checked ? 'on' : 'off'}`}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <span className="toggle-thumb" />
  </button>
);

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════════ */
const Settings = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [pageLoading, setPageLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ── Profile state ── */
  const [profileForm, setProfileForm] = useState({
    email: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
    avatarFile: null,
    avatarPreview: null,
  });
  const [profileErrors, setProfileErrors] = useState({});

  /* ── Site / Notifications state ── */
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'ANX E-Commerce',
    maintenanceMode: false,
    emailNotifications: true,
  });

  /* ── Hydrate email and avatar from auth context ── */
  useEffect(() => {
    if (user?.email) {
      setProfileForm(f => ({ 
        ...f, 
        email: user.email,
        avatarPreview: user.avatar || null
      }));
    }
  }, [user]);

  /* ── Load site settings on mount / tab switch ── */
  useEffect(() => {
    if (activeTab === 'site' || activeTab === 'notifications') {
      loadSiteSettings();
    }
  }, [activeTab]);

  const loadSiteSettings = async () => {
    setPageLoading(true);
    try {
      const res = await api.get('/admin/settings');
      setSiteSettings(res.data.settings);
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setPageLoading(false);
    }
  };

  /* ─── Profile save ─────────────────────────────────────────────────────── */
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErrors({});

    const hasEmailChange = profileForm.email !== user?.email;
    const hasPasswordChange = profileForm.new_password.length > 0;
    const hasAvatarChange = profileForm.avatarFile !== null;

    if (!hasEmailChange && !hasPasswordChange && !hasAvatarChange) {
      toast('No changes to save.', { icon: 'ℹ️' });
      return;
    }

    // Client-side validation
    const errs = {};
    if (!profileForm.current_password) {
      errs.current_password = 'Current password is required to make changes.';
    }
    if (hasPasswordChange && profileForm.new_password.length < 8) {
      errs.new_password = 'New password must be at least 8 characters.';
    }
    if (hasPasswordChange && profileForm.new_password !== profileForm.new_password_confirmation) {
      errs.new_password_confirmation = 'Passwords do not match.';
    }
    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('current_password', profileForm.current_password);
      
      if (hasEmailChange) formData.append('email', profileForm.email);
      if (hasPasswordChange) {
        formData.append('new_password', profileForm.new_password);
        formData.append('new_password_confirmation', profileForm.new_password_confirmation);
      }
      if (hasAvatarChange) {
        formData.append('avatar', profileForm.avatarFile);
      }

      const res = await api.post('/admin/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(res.data.message || 'Profile updated!');

      // Update auth context so navbar reflects new email/avatar
      if (res.data.user) updateUser(res.data.user);

      // Clear password fields and file object
      setProfileForm(f => ({
        ...f,
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
        avatarFile: null,
      }));
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      const serverErrors = error.response?.data?.errors || {};
      toast.error(msg);
      setProfileErrors(serverErrors);
    } finally {
      setSaving(false);
    }
  };

  /* ─── Site / Notifications save ────────────────────────────────────────── */
  const handleSettingsSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/admin/settings', siteSettings);
      setSiteSettings(res.data.settings);
      toast.success(res.data.message || 'Settings saved!');
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  /* ─── Tabs config ──────────────────────────────────────────────────────── */
  const tabs = [
    { key: 'profile', label: 'Admin Profile', icon: <FiUser /> },
    { key: 'site', label: 'Site Preferences', icon: <FiGlobe /> },
    { key: 'notifications', label: 'Notifications', icon: <FiBell /> },
  ];

  const isGoogleUser = user?.google_id && !user?.password;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">

        {/* Header */}
        <motion.div
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-header-content">
            <h1 className="admin-title"><FiSettings /> Platform Settings</h1>
            <p className="admin-subtitle">Configure your application settings</p>
          </div>
        </motion.div>

        <div className="settings-layout">

          {/* Sidebar nav */}
          <motion.div
            className="settings-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content area */}
          <motion.div
            className="settings-content-area"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AnimatePresence mode="wait">

              {/* ── PROFILE TAB ── */}
              {activeTab === 'profile' && (
                <motion.form
                  key="profile"
                  className="settings-card"
                  onSubmit={handleProfileSave}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <div className="card-header">
                    <h2><FiUser /> Profile Settings</h2>
                    <p className="card-subtitle">Update your admin email address and password</p>
                  </div>

                  <div className="card-body">

                    {/* Name & Avatar */}
                    <div className="form-section">
                      <div className="form-section-title">Account Info</div>
                      
                      <div className="avatar-upload-row">
                        <div className="avatar-preview">
                          {profileForm.avatarPreview ? (
                            <img src={profileForm.avatarPreview} alt="Admin Avatar" />
                          ) : (
                            <div className="avatar-placeholder"><FiUser /></div>
                          )}
                        </div>
                        <div className="avatar-actions">
                          <label htmlFor="avatar-upload" className="upload-btn">
                            <FiCamera /> Change Picture
                          </label>
                          <input 
                            type="file" 
                            id="avatar-upload" 
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setProfileForm(f => ({
                                  ...f,
                                  avatarFile: file,
                                  avatarPreview: URL.createObjectURL(file)
                                }));
                              }
                            }}
                          />
                          <span className="input-hint">JPG, PNG or GIF (Max 5MB)</span>
                        </div>
                      </div>

                      <div className="form-row">
                        <label htmlFor="admin-name">Display Name</label>
                        <input
                          id="admin-name"
                          type="text"
                          className="settings-input"
                          defaultValue={user?.name}
                          disabled
                        />
                        <span className="input-hint">Name cannot be changed from this panel.</span>
                      </div>
                    </div>

                    <div className="form-divider" />

                    {/* Email change */}
                    <div className="form-section">
                      <div className="form-section-title">
                        <FiMail /> Change Email
                      </div>
                      <div className="form-row">
                        <label htmlFor="admin-email">Email Address</label>
                        <input
                          id="admin-email"
                          type="email"
                          className={`settings-input ${profileErrors.email ? 'input-error' : ''}`}
                          value={profileForm.email}
                          onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="admin@example.com"
                          disabled={isGoogleUser}
                        />
                        {profileErrors.email && (
                          <span className="field-error"><FiAlertCircle /> {profileErrors.email}</span>
                        )}
                        {isGoogleUser && (
                          <span className="input-hint">Email is managed by Google and cannot be changed here.</span>
                        )}
                      </div>
                    </div>

                    <div className="form-divider" />

                    {/* Password change */}
                    <div className="form-section">
                      <div className="form-section-title">
                        <FiLock /> Change Password
                      </div>

                      {isGoogleUser ? (
                        <div className="info-banner">
                          <FiShield />
                          <span>You signed in with Google — password management is handled by your Google account.</span>
                        </div>
                      ) : (
                        <>
                          <div className="form-row">
                            <label htmlFor="admin-current-pw">Current Password <span className="required-star">*</span></label>
                            <PasswordInput
                              id="admin-current-pw"
                              value={profileForm.current_password}
                              onChange={e => setProfileForm(f => ({ ...f, current_password: e.target.value }))}
                              placeholder="Enter current password"
                            />
                            {profileErrors.current_password && (
                              <span className="field-error"><FiAlertCircle /> {Array.isArray(profileErrors.current_password) ? profileErrors.current_password[0] : profileErrors.current_password}</span>
                            )}
                            <span className="input-hint">Required to confirm any profile change.</span>
                          </div>

                          <div className="form-row">
                            <label htmlFor="admin-new-pw">New Password</label>
                            <PasswordInput
                              id="admin-new-pw"
                              value={profileForm.new_password}
                              onChange={e => setProfileForm(f => ({ ...f, new_password: e.target.value }))}
                              placeholder="Leave blank to keep current password"
                            />
                            {profileErrors.new_password && (
                              <span className="field-error"><FiAlertCircle /> {profileErrors.new_password}</span>
                            )}
                          </div>

                          <div className="form-row">
                            <label htmlFor="admin-confirm-pw">Confirm New Password</label>
                            <PasswordInput
                              id="admin-confirm-pw"
                              value={profileForm.new_password_confirmation}
                              onChange={e => setProfileForm(f => ({ ...f, new_password_confirmation: e.target.value }))}
                              placeholder="Repeat new password"
                            />
                            {profileErrors.new_password_confirmation && (
                              <span className="field-error"><FiAlertCircle /> {profileErrors.new_password_confirmation}</span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {!isGoogleUser && (
                    <div className="card-footer">
                      <motion.button
                        type="submit"
                        className="save-btn"
                        disabled={saving}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {saving ? <span className="btn-spinner" /> : <FiSave />}
                        {saving ? 'Saving…' : 'Save Changes'}
                      </motion.button>
                    </div>
                  )}
                </motion.form>
              )}

              {/* ── SITE PREFERENCES TAB ── */}
              {activeTab === 'site' && (
                <motion.div
                  key="site"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {pageLoading ? (
                    <SettingsSkeleton />
                  ) : (
                    <form className="settings-card" onSubmit={handleSettingsSave}>
                      <div className="card-header">
                        <h2><FiGlobe /> Site Preferences</h2>
                        <p className="card-subtitle">Manage your site-wide configuration</p>
                      </div>

                      <div className="card-body">
                        <div className="form-section">
                          <div className="form-section-title">General</div>
                          <div className="form-row">
                            <label htmlFor="site-name">Site Name</label>
                            <input
                              id="site-name"
                              type="text"
                              className="settings-input"
                              value={siteSettings.siteName}
                              onChange={e => setSiteSettings(s => ({ ...s, siteName: e.target.value }))}
                              placeholder="ANX E-Commerce"
                              maxLength={100}
                            />
                            <span className="input-hint">Displayed in the browser tab and emails.</span>
                          </div>
                        </div>

                        <div className="form-divider" />

                        <div className="form-section">
                          <div className="form-section-title">Maintenance</div>
                          <div className="toggle-row">
                            <div className="toggle-info">
                              <span className="toggle-label">Maintenance Mode</span>
                              <span className="toggle-desc">
                                When enabled, the storefront is replaced with a maintenance page for customers.
                              </span>
                            </div>
                            <Toggle
                              id="maintenance-toggle"
                              checked={siteSettings.maintenanceMode}
                              onChange={v => setSiteSettings(s => ({ ...s, maintenanceMode: v }))}
                            />
                          </div>
                          {siteSettings.maintenanceMode && (
                            <div className="warning-banner">
                              <FiAlertCircle />
                              <span>Maintenance mode is ON — customers cannot access the storefront!</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card-footer">
                        <motion.button
                          type="submit"
                          className="save-btn"
                          disabled={saving}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {saving ? <span className="btn-spinner" /> : <FiSave />}
                          {saving ? 'Saving…' : 'Save Changes'}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

              {/* ── NOTIFICATIONS TAB ── */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {pageLoading ? (
                    <SettingsSkeleton />
                  ) : (
                    <form className="settings-card" onSubmit={handleSettingsSave}>
                      <div className="card-header">
                        <h2><FiBell /> Notification Settings</h2>
                        <p className="card-subtitle">Control the alerts you receive as admin</p>
                      </div>

                      <div className="card-body">
                        <div className="form-section">
                          <div className="form-section-title">Email Alerts</div>

                          <div className="toggle-row">
                            <div className="toggle-info">
                              <span className="toggle-label">System Email Notifications</span>
                              <span className="toggle-desc">
                                Receive emails for new seller requests, disputes, and order alerts.
                              </span>
                            </div>
                            <Toggle
                              id="email-notifications-toggle"
                              checked={siteSettings.emailNotifications}
                              onChange={v => setSiteSettings(s => ({ ...s, emailNotifications: v }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card-footer">
                        <motion.button
                          type="submit"
                          className="save-btn"
                          disabled={saving}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {saving ? <span className="btn-spinner" /> : <FiSave />}
                          {saving ? 'Saving…' : 'Save Changes'}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
