



//this page shoyuld remove









import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ShareAltOutlined } from '@ant-design/icons';
import SecureShareModal from '../../thirdparty/SecureShareModal';
import { theme } from '../../../styles/theme';

const SecureShareTest = () => {
  const [showShareModal, setShowShareModal] = useState(false);

  // Mock project data for testing
  const testProjectData = {
    id: 'test-123',
    valuationJobId: 'VAL-86291',
    documentName: 'Final_Valuation_Report_Q4.pdf',
  };

  // Styles
  const containerStyle: CSSProperties = {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const buttonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '24px' }}>Secure Share Test Page</h1>
      <p style={{ marginBottom: '32px', color: theme.colors.text.secondary }}>
        Click the button below to test the secure share functionality
      </p>

      <button style={buttonStyle} onClick={() => setShowShareModal(true)}>
        <ShareAltOutlined />
        Share Securely
      </button>

      <SecureShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        projectData={testProjectData}
      />
    </div>
  );
};

export default SecureShareTest;