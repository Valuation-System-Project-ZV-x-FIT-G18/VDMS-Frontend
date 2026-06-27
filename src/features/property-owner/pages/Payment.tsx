import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { SearchOutlined, WarningOutlined } from '@ant-design/icons';
import InvoiceDetail from './InvoiceDetail';
import { theme } from '../../../styles/theme';
import { invoiceService } from '../../../services/invoiceService';
import type { Invoice } from '../../../services/invoiceService';

const DEFAULT_OWNER_CLIENT_ID = 'client-001';

const Payment = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        setError(null);

        const clientId = localStorage.getItem('ownerClientId') || DEFAULT_OWNER_CLIENT_ID;
        const data = await invoiceService.getAll({
          clientId,
          search: searchQuery || undefined,
        });

        setInvoices(data);
      } catch (err) {
        console.error('Error loading invoices:', err);
        setError('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [searchQuery]);

  const overdueCount = invoices.filter(i => i.status === 'Overdue').length;

  // Show invoice detail when clicked
  if (selectedInvoiceId) {
    return (
      <InvoiceDetail
        invoiceId={selectedInvoiceId}
        onBack={() => setSelectedInvoiceId(null)}
      />
    );
  }

  const filteredInvoices = invoices;

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Status badge colors
  const getStatusStyle = (status: Invoice['status']): CSSProperties => {
    const styles = {
      Overdue: { backgroundColor: '#fff1f0', color: '#ff4d4f' },
      Pending: { backgroundColor: '#fffbe6', color: '#faad14' },
      Paid: { backgroundColor: '#f6ffed', color: '#52c41a' },
    };
    return {
      ...styles[status],
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '13px',
      fontWeight: 500,
      display: 'inline-block',
    };
  };

  // Format amount
  const formatAmount = (amount: string | number) => {
    const value = typeof amount === 'string' ? Number(amount) : amount;
    return value.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  const formatDueDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

  // Styles
  const containerStyle: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
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
    marginBottom: '32px',
  };

  const alertStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '20px 24px',
    backgroundColor: '#fff1f0',
    border: '1px solid #ffccc7',
    borderRadius: '8px',
    marginBottom: '32px',
  };

  const alertIconStyle: CSSProperties = {
    fontSize: '24px',
    color: '#ff4d4f',
    marginTop: '2px',
  };

  const alertTitleStyle: CSSProperties = {
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.text.primary,
    marginBottom: '4px',
  };

  const alertDescStyle: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  };

  const searchContainerStyle: CSSProperties = {
    position: 'relative',
    marginBottom: '24px',
    maxWidth: '400px',
  };

  const searchIconStyle: CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    color: theme.colors.text.secondary,
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    padding: '10px 16px 10px 40px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const tableContainerStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #f0f0f0',
    overflow: 'hidden',
  };

  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: CSSProperties = {
    textAlign: 'left',
    padding: '16px 24px',
    fontSize: '13px',
    fontWeight: 600,
    color: theme.colors.text.primary,
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: '#fafafa',
  };

  const tdStyle: CSSProperties = {
    padding: '20px 24px',
    fontSize: '14px',
    color: theme.colors.text.primary,
    borderBottom: '1px solid #f0f0f0',
  };

  const invoiceIdStyle: CSSProperties = {
    fontWeight: 600,
    color: theme.colors.primary.main,
    fontSize: '14px',
    cursor: 'pointer',
  };

  const valuationJobIdStyle: CSSProperties = {
    color: theme.colors.primary.main,
    cursor: 'pointer',
  };

  const paginationStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    fontSize: '14px',
    color: theme.colors.text.secondary,
  };

  const pageButtonsStyle: CSSProperties = {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  };

  const getPageButtonStyle = (isActive: boolean): CSSProperties => ({
    padding: '6px 12px',
    border: `1px solid ${isActive ? theme.colors.primary.main : theme.colors.border}`,
    borderRadius: '4px',
    backgroundColor: isActive ? theme.colors.primary.main : 'white',
    color: isActive ? 'white' : theme.colors.text.primary,
    cursor: 'pointer',
    fontSize: '14px',
    minWidth: '36px',
    textAlign: 'center',
  });

  const navButtonStyle = (disabled: boolean): CSSProperties => ({
    padding: '6px 10px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '4px',
    backgroundColor: 'white',
    color: disabled ? '#d9d9d9' : theme.colors.text.primary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '16px',
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <h1 style={titleStyle}>Payment Management</h1>
      <p style={subtitleStyle}>
        Manage your invoices, view history, and process payments securely.
      </p>

      {/* Action Required Alert */}
      {overdueCount > 0 && (
        <div style={alertStyle}>
          <WarningOutlined style={alertIconStyle} />
          <div>
            <div style={alertTitleStyle}>Action Required</div>
            <div style={alertDescStyle}>
              You have {overdueCount} overdue invoices requiring immediate attention. Please settle them to avoid service interruption.
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div style={searchContainerStyle}>
        <SearchOutlined style={searchIconStyle} />
        <input
          type="text"
          placeholder="Search by Valuation job ID"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Table */}
      <div style={tableContainerStyle}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '32px', color: theme.colors.text.secondary }}>
            Loading invoices...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Invoice #</th>
              <th style={thStyle}>Valuation job ID</th>
              <th style={thStyle}>Amount (LKR)</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.length > 0 ? (
              currentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <td style={tdStyle}>
                    <span
                      style={invoiceIdStyle}
                      onClick={() => setSelectedInvoiceId(invoice.id)}
                    >
                      {invoice.invoiceId}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={valuationJobIdStyle}>
                      {invoice.project?.projectId || '-'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {formatAmount(invoice.amount)}
                  </td>
                  <td style={tdStyle}>{formatDueDate(invoice.dueDate)}</td>
                  <td style={tdStyle}>
                    <span style={getStatusStyle(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    ...tdStyle,
                    textAlign: 'center',
                    padding: '40px',
                    color: theme.colors.text.secondary,
                  }}
                >
                  No invoices found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}

        {/* Pagination */}
        {!loading && !error && (
        <div style={paginationStyle}>
          <span>
            Showing <strong>{startIndex + 1}</strong> to{' '}
            <strong>
              {Math.min(startIndex + itemsPerPage, filteredInvoices.length)}
            </strong>{' '}
            of <strong>{filteredInvoices.length}</strong> projects
          </span>

          <div style={pageButtonsStyle}>
            {/* Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={navButtonStyle(currentPage === 1)}
            >
              ‹
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={getPageButtonStyle(currentPage === pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Dots */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span style={{ padding: '6px 8px', color: theme.colors.text.secondary }}>
                ...
              </span>
            )}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={navButtonStyle(currentPage === totalPages)}
            >
              ›
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Payment;