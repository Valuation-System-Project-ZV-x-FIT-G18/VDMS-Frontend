import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { 
  FolderOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined, 
  CreditCardOutlined, 
  FileOutlined 
} from '@ant-design/icons';
import StatCard from '../../../components/atoms/StatCard';
import ProjectsTable from '../../../components/organisms/ProjectsTable';
import ValuationJobDetail from './ValuationJobDetail';
import { dashboardService } from '../../../services/dashboardService';
import type { DashboardStats } from '../../../services/dashboardService';
import type { Project } from '../types';
import { theme } from '../../../styles/theme';
import { getPortalClientId, uiDefaults } from '../../../config/portalConfig';

const BANK_CLIENT_ID = getPortalClientId('bank');
const RETRY_BUTTON_LABEL = 'Retry';

const EMPTY_STATS: DashboardStats = {
  totalProjects: 0,
  completedProjects: 0,
  activeProjects: 0,
  pendingPayments: 0,
  pendingDocuments: 0,
};

/**
 * Aggregates bank dashboard concerns so summary cards and recent jobs are loaded from one cohesive view model.
 */
const DashboardPage = () => {
  const [selectedValuationJob, setSelectedValuationJob] = useState<Project | null>(null);

  // ✅ NEW: State for API data
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [recentValuationJobs, setRecentValuationJobs] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    /**
     * Loads both summary and table data together so dashboard cards and list stay in sync.
     */
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        setWarning(null);

        const [statsResult, valuationJobsResult] = await Promise.allSettled([
          dashboardService.getStats(BANK_CLIENT_ID),
          dashboardService.getRecentProjects(uiDefaults.recentItemsLimit, BANK_CLIENT_ID),
        ]);

        const statsLoaded = statsResult.status === 'fulfilled';
        const jobsLoaded = valuationJobsResult.status === 'fulfilled';

        if (statsLoaded) {
          setStats(statsResult.value);
        } else {
          setStats(EMPTY_STATS);
          console.error('Dashboard stats error:', statsResult.reason);
        }

        if (jobsLoaded) {
          setRecentValuationJobs(valuationJobsResult.value);
        } else {
          setRecentValuationJobs([]);
          console.error('Recent valuation jobs error:', valuationJobsResult.reason);
        }

        if (!statsLoaded && !jobsLoaded) {
          setError('Failed to load dashboard data');
          return;
        }

        if (!statsLoaded || !jobsLoaded) {
          setWarning('Some dashboard sections could not be loaded.');
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [refreshKey]);

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
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 32px",
    boxSizing: "border-box",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "24px",
  };

  const titleStyle: CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: "8px",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
  };

  const statsGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  };

  const loadingStyle: CSSProperties = {
    textAlign: "center",
    padding: "40px",
    color: theme.colors.text.secondary,
  };

  const errorStyle: CSSProperties = {
    textAlign: "center",
    padding: "40px",
    color: "#dc2626",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <p>{error}</p>
          <button 
            onClick={() => setRefreshKey((current) => current + 1)}
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              backgroundColor: theme.colors.primary.main,
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {RETRY_BUTTON_LABEL}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
        <p style={subtitleStyle}>
          Showing valuation jobs assigned to your bank credit officer account.
        </p>
        {warning && (
          <p
            style={{
              marginTop: '12px',
              marginBottom: 0,
              color: '#d97706',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            {warning}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <StatCard
          title="Total Valuation Jobs"
          value={stats.totalProjects}
          icon={<FolderOutlined />}
          iconBgColor="#1890ff"
        />
        <StatCard
          title="Completed Valuation Jobs"
          value={stats.completedProjects}
          icon={<CheckCircleOutlined />}
          iconBgColor="#52c41a"
        />
        <StatCard
          title="Active Valuation Jobs"
          value={stats.activeProjects}
          icon={<FileTextOutlined />}
          iconBgColor="#13c2c2"
        />
        <StatCard
          title="Pending Payment"
          value={stats.pendingPayments}
          icon={<CreditCardOutlined />}
          iconBgColor="#722ed1"
        />
        <StatCard
          title="Pending Documents"
          value={stats.pendingDocuments}
          icon={<FileOutlined />}
          iconBgColor="#fa8c16"
        />
      </div>

      {/* Valuation Jobs Table */}
      <ProjectsTable 
        projects={recentValuationJobs} 
        showSearch 
        title="Recent valuation jobs"
        idLabel="Valuation Job ID"
        searchPlaceholder="Search valuation jobs..."
        onProjectClick={(valuationJobId) => {
          const selected = recentValuationJobs.find(
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
    </div>
  );
};

export default DashboardPage;
