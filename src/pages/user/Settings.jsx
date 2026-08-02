import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiUser, FiLock, FiMail, FiCamera, FiSave, FiAlertCircle, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './UserPages.css';

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

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
    avatarFile: null,
    avatarPreview: null,
  });
  const [profileErrors, setProfileErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm(f => ({
        ...f,
        name: user.name,
        email: user.email,
        avatarPreview: user.avatar || null,
      }));
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErrors({});

    const hasNameChange = profileForm.name !== user?.name;
    const hasEmailChange = profileForm.email !== user?.email;
    const hasPasswordChange = profileForm.new_password.length > 0;
    const hasAvatarChange = profileForm.avatarFile !== null;

    if (!hasNameChange && !hasEmailChange && !hasPasswordChange && !hasAvatarChange) {
      toast('No changes to save.', { icon: 'ℹ️' });
      return;
    }

    const errs = {};
    if (hasPasswordChange && !profileForm.current_password) {
      errs.current_password = 'Current password is required to change password.';
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
      if (hasNameChange) formData.append('name', profileForm.name);
      if (hasEmailChange) formData.append('email', profileForm.email);
      if (hasPasswordChange) {
        formData.append('current_password', profileForm.current_password);
        formData.append('new_password', profileForm.new_password);
        formData.append('new_password_confirmation', profileForm.new_password_confirmation);
      }
      if (hasAvatarChange) {
        formData.append('avatar', profileForm.avatarFile);
      }

      const res = await api.post('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success(res.data.message || 'Profile updated!');
      if (res.data.user) updateUser(res.data.user);

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

  const isGoogleUser = user?.google_id && !user?.password;

  return (
    <div className="user-page-container">
      <motion.div 
        className="user-page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1><FiSettings /> Settings</h1>
        <p>Manage your account preferences</p>
      </motion.div>

      <div className="user-page-content">
        <motion.form
          className="settings-card"
          onSubmit={handleProfileSave}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-header">
            <h2><FiUser /> Account Settings</h2>
          </div>

          <div className="card-body">
            {/* Avatar & Name */}
            <div className="form-section">
              <div className="form-section-title">Personal Info</div>
              
              <div className="avatar-upload-row">
                <div className="avatar-preview">
                  {profileForm.avatarPreview ? (
                    <img src={profileForm.avatarPreview} alt="User Avatar" />
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
                <label htmlFor="user-name">Display Name</label>
                <input
                  id="user-name"
                  type="text"
                  className={`settings-input ${profileErrors.name ? 'input-error' : ''}`}
                  value={profileForm.name}
                  onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                />
                {profileErrors.name && (
                  <span className="field-error"><FiAlertCircle /> {profileErrors.name}</span>
                )}
              </div>
            </div>

            <div className="form-divider" />

            {/* Email */}
            <div className="form-section">
              <div className="form-section-title"><FiMail /> Email Address</div>
              <div className="form-row">
                <input
                  id="user-email"
                  type="email"
                  className={`settings-input ${profileErrors.email ? 'input-error' : ''}`}
                  value={profileForm.email}
                  onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
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

            {/* Password */}
            <div className="form-section">
              <div className="form-section-title"><FiLock /> Change Password</div>
              {isGoogleUser ? (
                <div className="info-banner">
                  <FiShield />
                  <span>You signed in with Google — password management is handled by your Google account.</span>
                </div>
              ) : (
                <>
                  <div className="form-row">
                    <label htmlFor="user-current-pw">Current Password</label>
                    <PasswordInput
                      id="user-current-pw"
                      value={profileForm.current_password}
                      onChange={e => setProfileForm(f => ({ ...f, current_password: e.target.value }))}
                      placeholder="Required only to change password"
                    />
                    {profileErrors.current_password && (
                      <span className="field-error"><FiAlertCircle /> {Array.isArray(profileErrors.current_password) ? profileErrors.current_password[0] : profileErrors.current_password}</span>
                    )}
                  </div>
                  <div className="form-row">
                    <label htmlFor="user-new-pw">New Password</label>
                    <PasswordInput
                      id="user-new-pw"
                      value={profileForm.new_password}
                      onChange={e => setProfileForm(f => ({ ...f, new_password: e.target.value }))}
                      placeholder="Leave blank to keep current password"
                    />
                    {profileErrors.new_password && (
                      <span className="field-error"><FiAlertCircle /> {profileErrors.new_password}</span>
                    )}
                  </div>
                  <div className="form-row">
                    <label htmlFor="user-confirm-pw">Confirm New Password</label>
                    <PasswordInput
                      id="user-confirm-pw"
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
        </motion.form>
      </div>
    </div>
  );
};

export default Settings;
