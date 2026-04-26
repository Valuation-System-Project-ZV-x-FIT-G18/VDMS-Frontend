import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  EyeInvisibleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { theme } from '../../../styles/theme';
import {
  getAccountSettings,
  saveAccountSettings,
  type AccountSettingsRecord,
} from '../../../services/accountSettingsService';
import { uiDefaults } from '../../../config/portalConfig';

type OwnerSettingsViewModel = {
  fullName: string;
  nationalId: string;
  residentialAddress: string;
  email: string;
  phone: string;
  emailNotifications: boolean;
  smsAlerts: boolean;
  lastPasswordChange: string;
  lastLogin: {
    date: string;
    time: string;
    ip: string;
  };
};

type EditableOwnerField =
  | 'nationalId'
  | 'residentialAddress'
  | 'email'
  | 'phone'
  | 'emailNotifications'
  | 'smsAlerts';

/**
 * Guarantees a predictable initial shape for owner settings before network hydration.
 */
const createEmptyOwnerSettings = (): OwnerSettingsViewModel => ({
  fullName: '',
  nationalId: '',
  residentialAddress: '',
  email: '',
  phone: '',
  emailNotifications: false,
  smsAlerts: false,
  lastPasswordChange: 'Not available',
  lastLogin: {
    date: 'Not available',
    time: 'Not available',
    ip: 'Not available',
  },
});

/**
 * Prevents invalid backend dates from leaking as confusing text in the security section.
 */
const formatTimestamp = (value: string | null) => {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return date.toLocaleString();
};

/**
 * Adapts API response fields into page-specific state values used by inputs and badges.
 */
const mapRecordToViewModel = (record: AccountSettingsRecord): OwnerSettingsViewModel => {
  const lastLoginDate = record.lastLoginAt ? new Date(record.lastLoginAt) : null;

  return {
    fullName: record.fullName ?? '',
    nationalId: record.nationalId ?? '',
    residentialAddress: record.residentialAddress ?? '',
    email: record.email ?? '',
    phone: record.phone ?? '',
    emailNotifications: record.emailNotifications,
    smsAlerts: record.smsAlerts,
    lastPasswordChange: formatTimestamp(record.lastPasswordChangeAt),
    lastLogin: {
      date: lastLoginDate ? lastLoginDate.toLocaleDateString() : 'Not available',
      time: lastLoginDate ? lastLoginDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not available',
      ip: record.lastLoginIp ?? 'Not available',
    },
  };
};

/**
 * Controls owner settings edit lifecycle with explicit save/cancel semantics.
 */
const Settings = () => {
  const [originalData, setOriginalData] = useState<OwnerSettingsViewModel>(createEmptyOwnerSettings());
  const [userData, setUserData] = useState<OwnerSettingsViewModel>(createEmptyOwnerSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  /**
   * Restricts updates to editable fields so immutable display values are not overwritten.
   */
  const handleChange = (field: EditableOwnerField, value: string | boolean) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    /**
     * Loads persisted settings once to seed both current and rollback states.
     */
    let isActive = true;

    const loadSettings = async () => {
      try {
        const settings = await getAccountSettings('owner');

        if (!isActive) {
          return;
        }

        const viewModel = mapRecordToViewModel(settings);
        setOriginalData(viewModel);
        setUserData(viewModel);
      } catch (error) {
        console.error('Failed to load property owner settings:', error);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isActive = false;
    };
  }, []);

  /**
   * Saves only relevant owner fields for clarity and future API validation.
   */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await saveAccountSettings('owner', {
        fullName: userData.fullName,
        nationalId: userData.nationalId,
        residentialAddress: userData.residentialAddress,
        email: userData.email,
        phone: userData.phone,
        emailNotifications: userData.emailNotifications,
        smsAlerts: userData.smsAlerts,
      });

      const viewModel = mapRecordToViewModel(saved);
      setOriginalData(viewModel);
      setUserData(viewModel);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save property owner settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Reverts transient edits so the form always reflects last successful persistence.
   */
  const handleCancel = () => {
    setUserData({ ...originalData });
    setIsEditing(false);
  };

  /**
   * Validates password fields locally until dedicated password endpoints are introduced.
   */
  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < uiDefaults.passwordMinLength) {
      alert(`Password must be at least ${uiDefaults.passwordMinLength} characters long`);
      return;
    }

    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Styles
  const containerStyle: CSSProperties = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px',
  };

  const headerStyle: CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: '8px',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  };

  const cardStyle: CSSProperties = {
    backgroundColor: theme.colors.background.paper,
    borderRadius: '8px',
    padding: '32px',
    border: '1px solid #d9d9d9',
    marginBottom: '24px',
  };

  const sectionHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const sectionIconStyle: CSSProperties = {
    fontSize: '20px',
    color: theme.colors.primary.main,
  };

  const formRowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  };

  const formGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.colors.text.primary,
  };

  const inputStyle: CSSProperties = {
    padding: '12px 16px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
  };

  const disabledInputStyle: CSSProperties = {
    ...inputStyle,
    backgroundColor: '#fafafa',
    color: theme.colors.text.primary,
    cursor: 'not-allowed',
    border: '1px solid #f0f0f0',
  };

  const inputWithIconStyle: CSSProperties = {
    ...inputStyle,
    paddingLeft: '40px',
  };

  const inputWrapperStyle: CSSProperties = {
    position: 'relative',
  };

  const iconStyle: CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: theme.colors.text.secondary,
  };

  const helperTextStyle: CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text.secondary,
    marginTop: '4px',
  };

  const editButtonStyle: CSSProperties = {
    padding: '8px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): CSSProperties => {
    const baseStyle: CSSProperties = {
      padding: '10px 24px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s',
    };
    if (variant === 'primary') {
      return { ...baseStyle, backgroundColor: theme.colors.primary.main, color: 'white' };
    }
    return { ...baseStyle, backgroundColor: 'transparent', border: `1px solid ${theme.colors.border}`, color: theme.colors.text.primary };
  };

  const buttonGroupStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '32px',
  };

  const toggleContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #f0f0f0',
  };

  const toggleLabelStyle: CSSProperties = { flex: 1 };

  const toggleTitleStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.colors.text.primary,
    marginBottom: '4px',
  };

  const toggleDescStyle: CSSProperties = {
    fontSize: '13px',
    color: theme.colors.text.secondary,
  };

  const toggleSwitchStyle = (isOn: boolean): CSSProperties => ({
    width: '44px',
    height: '24px',
    backgroundColor: isOn ? theme.colors.primary.main : '#d9d9d9',
    borderRadius: '12px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s',
  });

  const toggleKnobStyle = (isOn: boolean): CSSProperties => ({
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isOn ? '22px' : '2px',
    transition: 'all 0.3s',
  });

  const securityRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
  };

  const infoBoxStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#e6f4ff',
    borderRadius: '6px',
    marginTop: '20px',
  };

  const modalOverlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '32px',
    maxWidth: '450px',
    width: '90%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };

  const modalHeaderStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '24px',
    color: theme.colors.text.primary,
  };

  return (
    <div style={containerStyle}>
      {isLoading && (
        <div style={{ marginBottom: '24px', color: theme.colors.text.secondary }}>
          Loading account settings...
        </div>
      )}

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Account Settings</h1>
        <p style={subtitleStyle}>Manage your profile details and preferences</p>
      </div>

      {/* Profile Information Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '16px', borderBottom: '2px solid #d9d9d9' }}>
          <div style={sectionHeaderStyle}>
            <UserOutlined style={sectionIconStyle} />
            <h2 style={sectionTitleStyle}>Profile Information</h2>
          </div>
          {!isEditing && (
            <button style={editButtonStyle} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {/* Full Name - Read Only */}
        <div style={{ ...formGroupStyle, marginBottom: '24px' }}>
          <label style={labelStyle}>Full Name</label>
          <div style={inputWrapperStyle}>
            <UserOutlined style={iconStyle} />
            <input
              type="text"
              value={userData.fullName}
              disabled
              style={{ ...disabledInputStyle, paddingLeft: '40px' }}
            />
          </div>
          <span style={helperTextStyle}>This field is managed by the system administrator.</span>
        </div>

        {/* National ID and Residential Address */}
        <div style={formRowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>National ID</label>
            <div style={inputWrapperStyle}>
              <IdcardOutlined style={iconStyle} />
              <input
                type="text"
                value={userData.nationalId}
                onChange={(e) => handleChange('nationalId', e.target.value)}
                disabled={!isEditing}
                style={isEditing ? inputWithIconStyle : { ...disabledInputStyle, paddingLeft: '40px' }}
                placeholder="Enter national ID"
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Residential Address</label>
            <div style={inputWrapperStyle}>
              <HomeOutlined style={iconStyle} />
              <input
                type="text"
                value={userData.residentialAddress}
                onChange={(e) => handleChange('residentialAddress', e.target.value)}
                disabled={!isEditing}
                style={isEditing ? inputWithIconStyle : { ...disabledInputStyle, paddingLeft: '40px' }}
                placeholder="Enter residential address"
              />
            </div>
          </div>
        </div>

        {/* Email and Phone */}
        <div style={formRowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapperStyle}>
              <MailOutlined style={iconStyle} />
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing}
                style={isEditing ? inputWithIconStyle : { ...disabledInputStyle, paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Phone Number</label>
            <div style={inputWrapperStyle}>
              <PhoneOutlined style={iconStyle} />
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                disabled={!isEditing}
                style={isEditing ? inputWithIconStyle : { ...disabledInputStyle, paddingLeft: '40px' }}
                placeholder="+94 XX XXX XXXX"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div style={buttonGroupStyle}>
            <button style={buttonStyle('secondary')} onClick={handleCancel}>
              Cancel
            </button>
            <button
              style={buttonStyle('primary')}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Notification Preferences Card */}
      <div style={cardStyle}>
        <div style={{ ...sectionHeaderStyle, marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #d9d9d9' }}>
          <span style={{ fontSize: '20px' }}>🔔</span>
          <h2 style={sectionTitleStyle}>Notification Preferences</h2>
        </div>

        <div style={toggleContainerStyle}>
          <div style={toggleLabelStyle}>
            <div style={toggleTitleStyle}>Email Notifications</div>
            <div style={toggleDescStyle}>Receive email updates for new valuation reports.</div>
          </div>
          <div
            style={toggleSwitchStyle(userData.emailNotifications)}
            onClick={() => handleChange('emailNotifications', !userData.emailNotifications)}
          >
            <div style={toggleKnobStyle(userData.emailNotifications)}></div>
          </div>
        </div>

        <div style={{ ...toggleContainerStyle, borderBottom: 'none', paddingBottom: 0 }}>
          <div style={toggleLabelStyle}>
            <div style={toggleTitleStyle}>SMS Alerts</div>
            <div style={toggleDescStyle}>Get text messages for critical status updates.</div>
          </div>
          <div
            style={toggleSwitchStyle(userData.smsAlerts)}
            onClick={() => handleChange('smsAlerts', !userData.smsAlerts)}
          >
            <div style={toggleKnobStyle(userData.smsAlerts)}></div>
          </div>
        </div>
      </div>

      {/* Security Card */}
      <div style={cardStyle}>
        <div style={{ ...sectionHeaderStyle, marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #d9d9d9' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <h2 style={sectionTitleStyle}>Security</h2>
        </div>

        <div style={securityRowStyle}>
          <div>
            <div style={toggleTitleStyle}>
              <EyeInvisibleOutlined style={{ marginRight: '8px' }} />
              Password
            </div>
            <div style={toggleDescStyle}>Last changed {userData.lastPasswordChange}</div>
          </div>
          <button
            style={editButtonStyle}
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </button>
        </div>

        <div style={infoBoxStyle}>
          <InfoCircleOutlined style={{ fontSize: '16px', color: theme.colors.primary.main, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: theme.colors.text.primary }}>
              <strong>Last login:</strong> {userData.lastLogin.date} at {userData.lastLogin.time} from IP {userData.lastLogin.ip}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={modalOverlayStyle} onClick={() => setShowPasswordModal(false)}>
          <div style={{ ...modalContentStyle, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalHeaderStyle}>Change Password</h3>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Enter current password"
              />
            </div>

            <div style={{ ...formGroupStyle, marginTop: '16px' }}>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Enter new password"
              />
              <span style={helperTextStyle}>Must be at least 8 characters long</span>
            </div>

            <div style={{ ...formGroupStyle, marginTop: '16px' }}>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                style={inputStyle}
                placeholder="Confirm new password"
              />
            </div>

            <div style={{ ...buttonGroupStyle, marginTop: '24px' }}>
              <button
                style={buttonStyle('secondary')}
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                Cancel
              </button>
              <button style={buttonStyle('primary')} onClick={handlePasswordChange}>
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;