import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import ProjectsTable from '../../../components/organisms/ProjectsTable';
import ValuationJobDetail from './ValuationJobDetail';
import { projectService } from '../../../services/projectService';
import type { Project } from '../../../services/projectService';
import { theme } from '../../../styles/theme';
import { getPortalClientId } from '../../../config/portalConfig';

const OWNER_CLIENT_ID = getPortalClientId('owner');
const retryButtonLabel = 'Retry';

/**
 * Manages owner project discovery with server-backed filtering and detail-page transition.
 */
const AllProjectsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFormat, setDateFormat] = useState<string>('mm/dd/yy');
  const [selectedValuationJob, setSelectedValuationJob] = useState<Project | null>(null);
  const [valuationJobs, setValuationJobs] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Re-queries the backend for each filter change to keep server-side filtering authoritative.
     */
    const fetchOwnerValuationJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const ownerValuationJobs = await projectService.getAll({
          status: statusFilter !== 'All' ? statusFilter : undefined,
          paymentStatus: paymentFilter !== 'All' ? paymentFilter : undefined,
          search: searchQuery || undefined,
          clientId: OWNER_CLIENT_ID,
        });

        setValuationJobs(ownerValuationJobs);
      } catch (err) {
        setError('Failed to load valuation jobs');
        console.error('Owner valuation jobs error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerValuationJobs();
  }, [statusFilter, paymentFilter, searchQuery]);

  // Show detail page when valuation job clicked
  if (selectedValuationJob) {
    return (
      <ValuationJobDetail
        projectId={selectedValuationJob.id}
        initialProject={selectedValuationJob}
        onBack={() => setSelectedValuationJob(null)}
      />
    );
  }

  const containerStyle: CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 32px',
    boxSizing: 'border-box',
  };

  const headerStyle: CSSProperties = {
    marginBottom: '24px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: '8px',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  };

  const filtersContainerStyle: CSSProperties = {
    backgroundColor: theme.colors.background.paper,
    padding: '20px 0',
    borderRadius: '8px',
    marginBottom: '24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  };

  const searchWrapperStyle: CSSProperties = {
    flex: 1,
    position: 'relative',
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    padding: '8px 16px 8px 36px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238c8c8c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cpath d=\'m21 21-4.35-4.35\'%3E%3C/path%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '12px center',
  };

  const selectStyle: CSSProperties = {
    padding: '8px 32px 8px 12px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: theme.colors.background.paper,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    minWidth: '150px',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Valuation Jobs</h1>
        <p style={subtitleStyle}>Manage and track your valuation jobs</p>
      </div>

      {/* Filters */}
      <div style={filtersContainerStyle}>
        <div style={searchWrapperStyle}>
          <input
            type="text"
            placeholder="Search by valuation job id or location"
            style={searchInputStyle}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">Status: All</option>
          <option value="Site Inspected">Site Inspected</option>
          <option value="Awaiting Docs">Awaiting Docs</option>
          <option value="Completed">Completed</option>
          <option value="Payment Pending">Payment Pending</option>
          <option value="Report Prepared">Report Prepared</option>
          <option value="In Progress">In Progress</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">Payment: All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          style={selectStyle}
        >
          <option value="mm/dd/yy">mm/dd/yy</option>
          <option value="dd/mm/yy">dd/mm/yy</option>
          <option value="yyyy-mm-dd">yyyy-mm-dd</option>
        </select>
      </div>

      {/* Valuation Jobs Table */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.text.secondary }}>
          Loading valuation jobs...
        </div>
      )}

      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: theme.colors.primary.main,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {retryButtonLabel}
          </button>
        </div>
      )}

      {!loading && !error && valuationJobs.length > 0 && (
        <ProjectsTable
          projects={valuationJobs}
          showSearch={false}
          title="Recent valuation jobs"
          idLabel="Valuation Job ID"
          onProjectClick={(valuationJobId) => {
            const selected = valuationJobs.find(
              (valuationJob) =>
                valuationJob.id === valuationJobId ||
                valuationJob.valuationJobId === valuationJobId ||
                valuationJob.projectId === valuationJobId,
            );
            if (selected) {
              setSelectedValuationJob(selected);
            }
          }}
        />
      )}

      {!loading && !error && valuationJobs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.text.secondary }}>
          No valuation jobs found.
        </div>
      )}
    </div>
  );
};

export default AllProjectsPage;