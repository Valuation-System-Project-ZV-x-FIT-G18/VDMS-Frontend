import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  BellOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { theme } from '../../../styles/theme';
import { invoiceService } from '../../../services/invoiceService';
import type { Invoice } from '../../../services/invoiceService';
import { formatAmountLkr, formatDateShort, getDaysRemaining } from '../../../utils/formatters';

interface InvoiceDetailProps {
  invoiceId: string;
  onBack: () => void;
}

const bankTransfer = {
  accountName: 'ZaVolt Valuations Pvt Ltd',
  bank: 'Sampath Bank',
  branch: 'Colombo Super Branch',
  accountNumber: '1000-234-567',
} as const;

/**
 * Encapsulates invoice payment actions and proof-upload flows in one owner-facing detail screen.
 */
const InvoiceDetail = ({ invoiceId, onBack }: InvoiceDetailProps) => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Loads invoice once for this route so all dependent cards derive from the same record.
     */
    const loadInvoice = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await invoiceService.getById(invoiceId);
        setInvoice(data);
      } catch (err) {
        console.error('Error loading invoice:', err);
        setError('Failed to load invoice details');
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId]);

  /**
   * Keeps payment status visuals consistent wherever status color is reused.
   */
  const getPaymentStatusColor = () => {
    const status = invoice?.status || 'Pending';
    const colors = {
      Pending: '#fa8c16',
      Paid: '#52c41a',
      Overdue: '#ff4d4f',
    };
    return colors[status];
  };

  /**
   * Uses backend invoice update endpoint and updates local state so upload feedback is immediate.
   */
  const handleFileUpload = async (file: File) => {
    if (!invoice) return;

    try {
      setIsUploading(true);
      const updated = await invoiceService.uploadPaymentProof(invoice.id, file.name);
      setInvoice(updated);
    } catch (err) {
      console.error('Error uploading payment proof:', err);
      setError('Failed to upload payment proof');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Allows drag-and-drop uploads to match the same processing path as file picker uploads.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  /**
   * Activates visual drop-state feedback without triggering browser-default file open behavior.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Resets drop-state styling as soon as pointer leaves drop target.
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Uses a transient file input to keep this screen dependency-free and lightweight.
   */
  const handleBrowseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        void handleFileUpload(file);
      }
    };
    input.click();
  };

  /**
   * Gives quick copy feedback so users know the transfer account number was captured.
   */
  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankTransfer.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  /**
   * Exports a text summary as a fallback so users can still keep invoice details offline.
   */
  const handleDownloadInvoice = () => {
    if (!invoice) return;

    const amount = formatAmountLkr(invoice.amount);
    const text = [
      `Invoice: ${invoice.invoiceId}`,
      `Project: ${invoice.project?.projectId || '-'}`,
      `Amount: LKR ${amount}`,
      `Due Date: ${formatDateShort(invoice.dueDate)}`,
      `Status: ${invoice.status}`,
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * Calls notification workflow endpoint and exposes a short success state to prevent duplicate clicks.
   */
  const handleNotifyL1Manager = async () => {
    if (!invoice) return;

    try {
      const updated = await invoiceService.notifyCoordinator(invoice.id);
      setInvoice(updated);
      setNotifySuccess(true);
      setTimeout(() => setNotifySuccess(false), 3000);
    } catch (err) {
      console.error('Error notifying L1 manager:', err);
      setError('Failed to notify L1 manager');
    }
  };

  const handleRemovePaymentProof = async () => {
    if (!invoice) return;

    try {
      const updated = await invoiceService.removePaymentProof(invoice.id);
      setInvoice(updated);
    } catch (err) {
      console.error('Error removing payment proof:', err);
      setError('Failed to remove payment proof');
    }
  };

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

  if (loading) {
    return (
      <div style={containerStyle}>
        <button style={backButtonStyle} onClick={onBack}>← Back</button>
        <div style={{ textAlign: 'center', padding: '32px', color: theme.colors.text.secondary }}>
          Loading invoice details...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={containerStyle}>
        <button style={backButtonStyle} onClick={onBack}>← Back</button>
        <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
          {error || 'Invoice not found'}
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(invoice.dueDate);
  const actionText = invoice.status === 'Paid' ? 'Completed' : 'Action Required';

  return (
    <div style={containerStyle}>
      <button style={backButtonStyle} onClick={onBack}>
        ← Back
      </button>

      <div style={topCardsStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            <span style={{ fontSize: '16px' }}>💳</span>
            Valuation Fee (LKR)
          </div>
          <div style={feeValueStyle}>{formatAmountLkr(invoice.amount)}</div>
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>
            <CalendarOutlined />
            Due Date
          </div>
          <div style={dueDateStyle}>{formatDateShort(invoice.dueDate)}</div>
          <div style={daysRemainingStyle}>
            <ClockCircleOutlined />
            {daysRemaining >= 0 ? `${daysRemaining} Days Remaining` : `${Math.abs(daysRemaining)} Days Overdue`}
          </div>
        </div>

        <div style={pendingCardStyle}>
          <div style={cardLabelStyle}>
            <span style={{ color: getPaymentStatusColor(), fontSize: '16px' }}>●</span>
            Payment Status
          </div>
          <div style={paymentStatusStyle}>{invoice.status}</div>
          <span style={actionRequiredStyle}>{actionText}</span>
        </div>
      </div>

      <div style={contentGridStyle}>
        <div>
          <div style={sectionCardStyle}>
            <div style={sectionHeaderStyle}>Project Information</div>
            <div style={sectionBodyStyle}>
              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Property Address</span>
                  <span style={infoValueStyle}>{invoice.project?.propertyAddress || '-'}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Bank Name</span>
                  <span style={infoValueStyle}>-</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Applicant Name</span>
                  <span style={infoValueStyle}>{invoice.project?.applicant || '-'}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={infoLabelStyle}>Valuation Type</span>
                  <span style={infoValueStyle}>Market Valuation</span>
                </div>
              </div>

              <div style={reportStatusStyle}>
                <div style={infoLabelStyle}>Report Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ color: '#52c41a', fontSize: '10px' }}>●</span>
                  <span style={infoValueStyle}>Prepared (Ready for Release upon Payment)</span>
                </div>
              </div>
            </div>
          </div>

          <div style={paymentMethodCardStyle}>
            <div style={{ ...sectionHeaderStyle, textAlign: 'left' }}>Payment Methods</div>

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

            <div style={bankDetailsGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Account Name</span>
                <span style={infoValueStyle}>{bankTransfer.accountName}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Bank</span>
                <span style={infoValueStyle}>{bankTransfer.bank}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Branch</span>
                <span style={infoValueStyle}>{bankTransfer.branch}</span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Account Number</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={infoValueStyle}>{bankTransfer.accountNumber}</span>
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

            <div style={referenceBoxStyle}>
              <InfoCircleOutlined style={{ color: '#fa8c16' }} />
              <span>
                Please use Project ID{' '}
                <strong style={{ color: '#fa8c16' }}>{invoice.project?.projectId || '-'}</strong>
                {' '}as the reference.
              </span>
            </div>
          </div>
        </div>

        <div>
          <div style={{ ...sectionCardStyle, padding: '24px' }}>
            <div
              style={dropZoneStyle}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleBrowseFile}
            >
              <CloudUploadOutlined style={{ fontSize: '36px', color: '#8c8c8c', marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                Drag & drop or <span style={{ color: theme.colors.primary.main, cursor: 'pointer' }}>browse</span>
              </div>
            </div>

            {invoice.paymentProofFileName && (
              <div style={uploadedFileStyle}>
                <span style={{ fontSize: '20px' }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{invoice.paymentProofFileName}</div>
                  <div style={{ fontSize: '12px', color: '#fa8c16' }}>
                    ● Uploaded
                  </div>
                </div>
                <button
                  style={{
                    border: '1px solid #d9d9d9',
                    backgroundColor: '#fff',
                    color: '#595959',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  onClick={() => {
                    void handleRemovePaymentProof();
                  }}
                >
                  Remove
                </button>
              </div>
            )}

            <button style={uploadButtonStyle} onClick={handleBrowseFile} disabled={isUploading}>
              <CloudUploadOutlined />
              {isUploading ? 'Uploading...' : 'Upload Payment Proof'}
            </button>

            <button style={outlineButtonStyle} onClick={handleDownloadInvoice}>
              <DownloadOutlined />
              Download Invoice
            </button>

            <button
              style={{
                ...outlineButtonStyle,
                color: notifySuccess ? '#52c41a' : theme.colors.text.primary,
                borderColor: notifySuccess ? '#52c41a' : theme.colors.border,
              }}
              onClick={() => {
                void handleNotifyL1Manager();
              }}
            >
              {notifySuccess ? <><CheckCircleOutlined /> L1 Manager Notified!</> : <><BellOutlined /> Notify L1 Manager</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
