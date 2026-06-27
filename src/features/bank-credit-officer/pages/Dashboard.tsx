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
import valuationJobService, { type ValuationJob, type JobStats } from '../../../services/valuationJobService';
import { theme } from '../../../styles/theme';

const DashboardPage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [stats, setStats] = useState<JobStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<ValuationJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, jobsData] = await Promise.all([
        valuationJobService.getStats(),
        valuationJobService.getJobs(),
      ]);
      setStats(statsData);
      setRecentProjects(jobsData.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };
import { dashboardService } from '../../../services/dashboardService';
import type { DashboardStats } from '../../../services/dashboardService';
import type { Project } from '../types';
import { theme } from '../../../styles/theme';

const DashboardPage = () => {
  const [selectedValuationJob, setSelectedValuationJob] = useState<Project | null>(null);
  
  // ✅ NEW: State for API data
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    pendingPayments: 0,
    pendingDocuments: 0,
  });
  const [recentValuationJobs, setRecentValuationJobs] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ NEW: Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, valuationJobsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentProjects(5),
        ]);

        setStats(statsData);
        setRecentValuationJobs(valuationJobsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  const statsGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  };

  const loadingStyle: CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: theme.colors.text.secondary,
  };

  const errorStyle: CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#dc2626',
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading dashboard...</div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
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
            Retry
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
          Welcome back, here's what's happening with your valuation jobs today.
        </p>
      </div>

      {/* Stats Cards - ✅ Using REAL data from backend */}
      <div style={statsGridStyle}>
        <StatCard
          title="Total Project"
          value={stats?.totalProjects || 0}
          title="Total Valuation Jobs"
          value={stats.totalProjects}
          icon={<FolderOutlined />}
          iconBgColor="#1890ff"
        />
        <StatCard
          title="Completed Project"
          value={stats?.completedProjects || 0}
          title="Completed Valuation Jobs"
          value={stats.completedProjects}
          icon={<CheckCircleOutlined />}
          iconBgColor="#52c41a"
        />
        <StatCard
          title="Active Project"
          value={stats?.activeProjects || 0}
          title="Active Valuation Jobs"
          value={stats.activeProjects}
          icon={<FileTextOutlined />}
          iconBgColor="#13c2c2"
        />
        <StatCard
          title="Pending Payment"
          value={stats?.pendingPayment || 0}
          value={stats.pendingPayments}
          icon={<CreditCardOutlined />}
          iconBgColor="#722ed1"
        />
        <StatCard
          title="Pending Document"
          value={stats?.pendingDocuments || 0}
          title="Pending Documents"
          value={stats.pendingDocuments}
          icon={<FileOutlined />}
          iconBgColor="#fa8c16"
        />
      </div>

      {/* Projects Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading data...</div>
      ) : (
        <ProjectsTable
          projects={recentProjects as any}
          showSearch
          onProjectClick={(projectId) => setSelectedProjectId(projectId)}
        />
      )}
      {/* Valuation Jobs Table - ✅ Using REAL data from backend */}
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