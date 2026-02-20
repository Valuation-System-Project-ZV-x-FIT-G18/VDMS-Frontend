import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ShareAltOutlined,
  CheckCircleFilled,
  MailOutlined,
  LockOutlined,
  CalendarOutlined,
  EyeInvisibleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { theme } from '../../styles/theme';

interface SecureShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: {
    id: string;
    valuationJobId: string;
    documentName: string;
  };
}

const SecureShareModal = ({ isOpen, onClose, projectData }: SecureShareModalProps) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shareData, setShareData] = useState({
    recipientEmail: '',
    password: '',
    expiryDays: '7',
  });
  const [generatedLink, setGeneratedLink] = useState({
    url: '',
    password: '',
    expiryDate: '',
  });

  const handleShareInputChange = (field: string, value: string) => {
    setShareData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateLink = () => {
    // TODO: Call backend API to generate actual secure link
    const mockUrl = `https://share.secure-val.com/vjs-report-2024-vs02${Math.floor(Math.random() * 1000)}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(shareData.expiryDays));

    setGeneratedLink({
      url: mockUrl,
      password: shareData.password,
      expiryDate: expiryDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }),
    });

    setShowSuccessModal(true);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedLink.url);
    alert('Link copied to clipboard!');
  };

  const handleSendEmail = () => {
    // TODO: Call backend API to send email
    alert(`Secure link sent to ${shareData.recipientEmail}`);
    handleCloseAll();
  };

  const handleCloseAll = () => {
    setShowSuccessModal(false);
    setShareData({ recipientEmail: '', password: '', expiryDays: '7' });
    onClose();
  };

  if (!isOpen && !showSuccessModal) return null;

  // Styles
  const modalOverlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  };

  const modalContentStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '480px',
    maxWidth: '90%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    position: 'relative',
  };

  const closeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: '24px',
    right: '24px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
  };

  const modalHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
  };

  const modalTitleStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: theme.colors.text.primary,
    margin: 0,
  };

  const modalSubtitleStyle: CSSProperties = {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    marginBottom: '24px',
  };

  const formRowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px',
  };

  const formGroupStyle: CSSProperties = {
    marginBottom: '20px',
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: theme.colors.text.primary,
    marginBottom: '8px',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  };

  const disabledInputStyle: CSSProperties = {
    ...inputStyle,
    backgroundColor: '#f5f5f5',
    color: theme.colors.text.secondary,
    cursor: 'not-allowed',
  };

  const helperTextStyle: CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text.secondary,
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const expiryOptionsStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  const expiryButtonStyle = (isActive: boolean): CSSProperties => ({
    flex: 1,
    padding: '12px',
    border: `1px solid ${isActive ? theme.colors.primary.main : theme.colors.border}`,
    borderRadius: '6px',
    backgroundColor: isActive ? '#e6f4ff' : 'white',
    color: isActive ? theme.colors.primary.main : theme.colors.text.primary,
    cursor: 'pointer',
    fontSize: '13px',
    textAlign: 'center',
    fontWeight: isActive ? 600 : 400,
  });

  const buttonGroupStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '28px',
  };

  const secondaryButtonStyle: CSSProperties = {
    padding: '10px 24px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    backgroundColor: 'white',
    color: theme.colors.text.primary,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };

  const primaryButtonStyle: CSSProperties = {
    padding: '10px 24px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const successIconStyle: CSSProperties = {
    fontSize: '48px',
    color: '#52c41a',
    textAlign: 'center',
    marginBottom: '16px',
  };

  const successTitleStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: '8px',
  };

  const successSubtitleStyle: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: '24px',
  };

  const urlBoxStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    marginBottom: '20px',
  };

  const urlTextStyle: CSSProperties = {
    flex: 1,
    fontSize: '13px',
    color: theme.colors.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const copyButtonStyle: CSSProperties = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const infoRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  };

  const infoLabelStyle: CSSProperties = {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const infoValueStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.colors.text.primary,
  };

  const noteBoxStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#e6f4ff',
    borderRadius: '6px',
    marginTop: '20px',
    marginBottom: '24px',
  };

  const sendEmailButtonStyle: CSSProperties = {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const closeTextButtonStyle: CSSProperties = {
    width: '100%',
    padding: '10px',
    border: 'none',
    background: 'none',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '12px',
  };

  return (
    <>
      {/* First Modal - Create Share Link */}
      {isOpen && !showSuccessModal && (
        <div style={modalOverlayStyle} onClick={handleCloseAll}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <button style={closeButtonStyle} onClick={handleCloseAll}>×</button>

            <div style={modalHeaderStyle}>
              <CheckCircleFilled style={{ fontSize: '24px', color: theme.colors.primary.main }} />
              <h3 style={modalTitleStyle}>Create Secure Share Link</h3>
            </div>
            <p style={modalSubtitleStyle}>Encrypted link generation for external stakeholders.</p>

            {/* Valuation Job ID and Document Name */}
            <div style={formRowStyle}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Valuation Job ID</label>
                <input type="text" value={projectData.valuationJobId} disabled style={disabledInputStyle} />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Document Name</label>
                <input type="text" value={projectData.documentName} disabled style={disabledInputStyle} />
              </div>
            </div>

            {/* Recipient Email */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Recipient Email Address</label>
              <input
                type="email"
                value={shareData.recipientEmail}
                onChange={(e) => handleShareInputChange('recipientEmail', e.target.value)}
                placeholder="e.g., client@investorgroup.com"
                style={inputStyle}
              />
            </div>

            {/* Security Password */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Security Password</label>
              <input
                type="password"
                value={shareData.password}
                onChange={(e) => handleShareInputChange('password', e.target.value)}
                placeholder="••••••••"
                style={inputStyle}
              />
              <p style={helperTextStyle}>
                <EyeInvisibleOutlined />
                Passwords must be shared separately with the recipient.
              </p>
            </div>

            {/* Access Expiry */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Access Expiry</label>
              <div style={expiryOptionsStyle}>
                <button
                  style={expiryButtonStyle(shareData.expiryDays === '7')}
                  onClick={() => handleShareInputChange('expiryDays', '7')}
                >
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>7</div>
                  <div style={{ fontSize: '11px' }}>Days</div>
                </button>
                <button
                  style={expiryButtonStyle(shareData.expiryDays === '14')}
                  onClick={() => handleShareInputChange('expiryDays', '14')}
                >
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>14</div>
                  <div style={{ fontSize: '11px' }}>Days</div>
                </button>
                <button
                  style={expiryButtonStyle(shareData.expiryDays === 'custom')}
                  onClick={() => handleShareInputChange('expiryDays', 'custom')}
                >
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>📅</div>
                  <div style={{ fontSize: '11px' }}>Custom</div>
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div style={buttonGroupStyle}>
              <button style={secondaryButtonStyle} onClick={handleCloseAll}>Cancel</button>
              <button
                style={primaryButtonStyle}
                onClick={handleGenerateLink}
                disabled={!shareData.recipientEmail || !shareData.password}
              >
                Generate Link <ShareAltOutlined />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal - Success */}
      {showSuccessModal && (
        <div style={modalOverlayStyle} onClick={handleCloseAll}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={successIconStyle}>
              <CheckCircleFilled />
            </div>

            <h3 style={successTitleStyle}>Secure Link Created</h3>
            <p style={successSubtitleStyle}>{projectData.documentName}</p>

            {/* Access URL */}
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px' }}>Access URL</label>
              <div style={urlBoxStyle}>
                <span style={urlTextStyle}>{generatedLink.url}</span>
                <button style={copyButtonStyle} onClick={handleCopyUrl}>
                  <CopyOutlined /> Copy
                </button>
              </div>
            </div>

            {/* Access Password */}
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>
                <LockOutlined /> Access Password
              </span>
              <span style={infoValueStyle}>{generatedLink.password}</span>
            </div>

            {/* Link Expires On */}
            <div style={{ ...infoRowStyle, borderBottom: 'none' }}>
              <span style={infoLabelStyle}>
                <CalendarOutlined /> Link Expires On
              </span>
              <span style={infoValueStyle}>
                {generatedLink.expiryDate}
                <span style={{ fontSize: '12px', color: '#faad14', marginLeft: '8px' }}>
                  {shareData.expiryDays} Days
                </span>
              </span>
            </div>

            {/* Note */}
            <div style={noteBoxStyle}>
              <span style={{ fontSize: '16px' }}>ℹ️</span>
              <p style={{ fontSize: '13px', color: theme.colors.text.primary, margin: 0 }}>
                This is a secure link. Recipients will be required to enter the access password
                provided above. All access attempts are logged for compliance.
              </p>
            </div>

            {/* Send Email */}
            <button style={sendEmailButtonStyle} onClick={handleSendEmail}>
              <MailOutlined /> Send Email Now
            </button>

            {/* Close */}
            <button style={closeTextButtonStyle} onClick={handleCloseAll}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default SecureShareModal;