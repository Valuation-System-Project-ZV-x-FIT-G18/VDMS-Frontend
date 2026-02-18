import { useState } from 'react';
import type { CSSProperties } from 'react';
import {
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  BellOutlined,
  CloseOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { theme } from '../../../styles/theme';

interface InvoiceDetailProps {
  invoiceId: string;
  onBack: () => void;
}

const InvoiceDetail = ({ invoiceId, onBack }: InvoiceDetailProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'awaiting' | 'verified'>('awaiting');
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Mock data - will come from API/database later
  const invoiceData = {
    invoiceId,
    valuationFee: 45000.00,
    dueDate: 'Oct 25, 2023',
    daysRemaining: 3,
    paymentStatus: 'Pending' as 'Pending' | 'Paid' | 'Overdue',
    projectInfo: {
      propertyAddress: '123 Galle Rd, Colombo 03',
      bankName: 'Commercial Bank',
      applicantName: 'Mr. Perera',
      valuationType: 'Land & Building',
      reportStatus: 'Prepared (Ready for Release upon Payment)',
    },
    bankTransfer: {
      accountName: 'ZaVolt Valuations Pvt Ltd',
      bank: 'Sampath Bank',
      branch: 'Colombo Super Branch',
      accountNumber: '1000-234-567',
    },
    projectReference: 'VAL-2023-889',
    uploadedFile: {
      name: 'Transfer_Slip_Oct24.jpg',
      status: 'Awaiting verification',
    },
  };

  const getPaymentStatusColor = () => {
    const colors = {
      Pending: '#fa8c16',
      Paid: '#52c41a',
      Overdue: '#ff4d4f',
    };
    return colors[invoiceData.paymentStatus];
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus('idle');

    setTimeout(() => {
      setIsUploading(false);
      setUploadStatus('awaiting');
      alert(`File "${file.name}" uploaded successfully! Awaiting verification.`);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBrowseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileUpload(file);
    };
    input.click();
  };

  // Copy account number
  const handleCopyAccount = () => {
    navigator.clipboard.writeText(invoiceData.bankTransfer.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Download invoice (mock)
  const handleDownloadInvoice = () => {
    alert('Invoice download started!\n\nTODO: Generate and download PDF invoice from backend.');
  };

  // Notify coordinator (mock)
  const handleNotifyCoordinator = () => {
    setNotifySuccess(true);
    setTimeout(() => setNotifySuccess(false), 3000);
    alert('Coordinator has been notified!\n\nTODO: Send notification to coordinator via backend.');
  };

  // Styles
  const containerStyle: CSSProperties = {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px',
  };

  const backButtonStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    color: theme.colors.primary.main,
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const topCardsStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px 24px',
    border: '1px solid #f0f0f0',
  };

  const pendingCardStyle: CSSProperties = {
    ...cardStyle,
    borderRight: `4px solid ${getPaymentStatusColor()}`,
  };

  const cardLabelStyle: CSSProperties = {
    fontSize: '13px',
    color: theme.colors.text.secondary,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const feeValueStyle: CSSProperties = {
    fontSize: '36px',
    fontWeight: 700,
    color: theme.colors.text.primary,
  };

  const dueDateStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: '8px',
  };

  const daysRemainingStyle: CSSProperties = {
    fontSize: '13px',
    color: '#fa8c16',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const paymentStatusStyle: CSSProperties = {
    fontSize: '32px',
    fontWeight: 700,
    color: getPaymentStatusColor(),
    marginBottom: '8px',
  };

  const actionRequiredStyle: CSSProperties = {
    fontSize: '13px',
    color: getPaymentStatusColor(),
    backgroundColor: getPaymentStatusColor() + '15',
    padding: '4px 10px',
    borderRadius: '4px',
    display: 'inline-block',
  };

  const contentGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '24px',
  };

  const sectionCardStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
    marginBottom: '24px',
  };

  const sectionHeaderStyle: CSSProperties = {
    padding: '14px 24px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.text.primary,
    textAlign: 'center' as const,
  };

  const sectionBodyStyle: CSSProperties = {
    padding: '24px',
  };

  const infoGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  };

  const infoItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const infoLabelStyle: CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text.secondary,
  };

  const infoValueStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.colors.text.primary,
  };

  const reportStatusStyle: CSSProperties = {
    padding: '16px 0 0 0',
    borderTop: '1px solid #f0f0f0',
    marginTop: '16px',
  };

  const paymentMethodCardStyle: CSSProperties = {
    ...sectionCardStyle,
    marginBottom: 0,
  };

  const bankTransferStyle: CSSProperties = {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    padding: '20px 24px',
    borderBottom: '1px solid #f0f0f0',
  };

  const bankIconStyle: CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#e6f4ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    color: theme.colors.primary.main,
    flexShrink: 0,
  };

  const bankDetailsGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    padding: '20px 24px',
  };

  const referenceBoxStyle: CSSProperties = {
    margin: '0 24px 20px 24px',
    padding: '12px 16px',
    backgroundColor: '#fff7e6',
    borderRadius: '6px',
    fontSize: '13px',
    color: theme.colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const dropZoneStyle: CSSProperties = {
    border: `2px dashed ${isDragging ? theme.colors.primary.main : '#d9d9d9'}`,
    borderRadius: '8px',
    padding: '32px 24px',
    textAlign: 'center',
    backgroundColor: isDragging ? '#e6f4ff' : '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '16px',
  };

  const uploadedFileStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#fff7e6',
    borderRadius: '6px',
    marginBottom: '16px',
  };

  const uploadButtonStyle: CSSProperties = {
    width: '100%',
    padding: '14px',
    backgroundColor: theme.colors.primary.main,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '16px',
  };

  const outlineButtonStyle: CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'white',
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px',
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button style={backButtonStyle} onClick={onBack}>
        ← Back
      </button>

      {/* Top 3 Cards */}
      <div style={topCardsStyle}>
        {/* Valuation Fee */}
        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            <span style={{ fontSize: '16px' }}>💳</span>
            Valuation Fee (LKR)
          </div>
          <div style={feeValueStyle}>
            {invoiceData.valuationFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Due Date */}
        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            <CalendarOutlined />
            Due Date
          </div>
          <div style={dueDateStyle}>{invoiceData.dueDate}</div>
          <div style={daysRemainingStyle}>
            <ClockCircleOutlined />
            {invoiceData.daysRemaining} Days Remaining
          </div>
        </div>

        {/* Payment Status */}
        <div style={pendingCardStyle}>
          <div style={cardLabelStyle}>
            <span style={{ color: getPaymentStatusColor(), fontSize: '16px' }}>●</span>
            Payment Status
          </div>
          <div style={paymentStatusStyle}>{invoiceData.paymentStatus}</div>
          <span style={actionRequiredStyle}>Action Required</span>
        </div>
      </div>

      {/* Content Grid */}
      <div style={contentGridStyle}>
        {/* Left Column */}
        <div>
          {/* Project Information */}
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>Project Information</div>
            <div style={sectionBodyStyle}>
              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Property Address</span>
                  <span style={infoValueStyle}>{invoiceData.projectInfo.propertyAddress}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Bank Name</span>
                  <span style={infoValueStyle}>{invoiceData.projectInfo.bankName}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Applicant Name</span>
                  <span style={infoValueStyle}>{invoiceData.projectInfo.applicantName}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Valuation Type</span>
                  <span style={infoValueStyle}>{invoiceData.projectInfo.valuationType}</span>
                </div>
              </div>

              {/* Report Status */}
              <div style={reportStatusStyle}>
                <div style={infoLabelStyle}>Report Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ color: '#52c41a', fontSize: '10px' }}>●</span>
                  <span style={infoValueStyle}>{invoiceData.projectInfo.reportStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={paymentMethodCardStyle}>
            <div style={{ ...sectionHeaderStyle, textAlign: 'left' }}>Payment Methods</div>

            {/* Bank Transfer */}
            <div style={bankTransferStyle}>
              <div style={bankIconStyle}>
                <BankOutlined />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Bank Transfer</div>
                <div style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
                  Please transfer the full amount to the account details below.
                </div>
              </div>
            </div>

            {/* Bank Details Grid */}
            <div style={bankDetailsGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Account Name</span>
                <span style={infoValueStyle}>{invoiceData.bankTransfer.accountName}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Bank</span>
                <span style={infoValueStyle}>{invoiceData.bankTransfer.bank}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Branch</span>
                <span style={infoValueStyle}>{invoiceData.bankTransfer.branch}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Account Number</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={infoValueStyle}>{invoiceData.bankTransfer.accountNumber}</span>
                  <button
                    onClick={handleCopyAccount}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.primary.main }}
                    title="Copy account number"
                  >
                    {copiedAccount ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reference Box */}
            <div style={referenceBoxStyle}>
              <InfoCircleOutlined style={{ color: '#fa8c16' }} />
              <span>
                Please use Project ID{' '}
                <strong style={{ color: '#fa8c16' }}>{invoiceData.projectReference}</strong>
                {' '}as the reference.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Upload Section */}
          <div style={{ ...sectionCardStyle, padding: '24px' }}>
            {/* Drop Zone */}
            <div
              style={dropZoneStyle}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleBrowseFile}
            >
              <CloudUploadOutlined style={{ fontSize: '36px', color: '#8c8c8c', marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                Drag & drop or{' '}
                <span style={{ color: theme.colors.primary.main, cursor: 'pointer' }}>browse</span>
              </div>
            </div>

            {/* Uploaded File */}
            {(uploadedFile || uploadStatus === 'awaiting') && (
              <div style={uploadedFileStyle}>
                <span style={{ fontSize: '20px' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>
                    {uploadedFile ? uploadedFile.name : invoiceData.uploadedFile.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#fa8c16' }}>
                    ● {isUploading ? 'Uploading...' : invoiceData.uploadedFile.status}
                  </div>
                </div>
                <button
                  onClick={() => { setUploadedFile(null); setUploadStatus('idle'); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.colors.text.secondary }}
                >
                  <CloseOutlined />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <button
              style={uploadButtonStyle}
              onClick={handleBrowseFile}
              disabled={isUploading}
            >
              <CloudUploadOutlined />
              {isUploading ? 'Uploading...' : 'Upload Payment Proof'}
            </button>

            {/* Download Invoice */}
            <button style={outlineButtonStyle} onClick={handleDownloadInvoice}>
              <DownloadOutlined />
              Download Invoice
            </button>

            {/* Notify Coordinator */}
            <button
              style={{
                ...outlineButtonStyle,
                color: notifySuccess ? '#52c41a' : theme.colors.text.primary,
                borderColor: notifySuccess ? '#52c41a' : theme.colors.border,
              }}
              onClick={handleNotifyCoordinator}
            >
              {notifySuccess
                ? <><CheckCircleOutlined /> Coordinator Notified!</>
                : <><BellOutlined /> Notify Coordinator</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;