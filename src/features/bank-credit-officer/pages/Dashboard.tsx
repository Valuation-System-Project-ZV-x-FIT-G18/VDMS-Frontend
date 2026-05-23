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

  if (selectedProjectId) {
    return (
      <ValuationJobDetail 
        projectId={selectedProjectId} 
        onBack={() => setSelectedProjectId(null)} 
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

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
        <p style={subtitleStyle}>
          welcome back, here's what's happening with your valuation job today
        </p>
      </div>

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <StatCard
          title="Total Project"
          value={stats?.totalProjects || 0}
          icon={<FolderOutlined />}
          iconBgColor="#1890ff"
        />
        <StatCard
          title="Completed Project"
          value={stats?.completedProjects || 0}
          icon={<CheckCircleOutlined />}
          iconBgColor="#52c41a"
        />
        <StatCard
          title="Active Project"
          value={stats?.activeProjects || 0}
          icon={<FileTextOutlined />}
          iconBgColor="#13c2c2"
        />
        <StatCard
          title="Pending Payment"
          value={stats?.pendingPayment || 0}
          icon={<CreditCardOutlined />}
          iconBgColor="#722ed1"
        />
        <StatCard
          title="Pending Document"
          value={stats?.pendingDocuments || 0}
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
    </div>
  );
};

export default DashboardPage;