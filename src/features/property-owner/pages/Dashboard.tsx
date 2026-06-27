import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import {
 FolderOutlined, 
  CheckCircleOutlined,
   FileTextOutlined, 
  CreditCardOutlined,
  FileOutlined,
} from '@ant-design/icons'; 
import StatCard from '../../../components/atoms/StatCard';
import ProjectsTable from '../../../components/organisms/ProjectsTable';
import ValuationJobDetail from './ValuationJobDetail';
import { projectService } from '../../../services/projectService';
import type { Project } from '../../../services/projectService';
import { theme } from '../../../styles/theme';

const DEFAULT_OWNER_CLIENT_ID = 'client-001';

const DashboardPage = () => {
  const [selectedValuationJob, setSelectedValuationJob] = useState<Project | null>(null);
  const [valuationJobs, setValuationJobs] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const clientId = localStorage.getItem('ownerClientId') || DEFAULT_OWNER_CLIENT_ID;
        const ownerValuationJobs = await projectService.getAll({ clientId });
        setValuationJobs(ownerValuationJobs);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Owner dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDashboardData();
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

  const stats = {
    totalValuationJobs: valuationJobs.length,
    completedValuationJobs: valuationJobs.filter((p) => p.status === 'Completed').length,
    activeValuationJobs: valuationJobs.filter(
      (p) =>
        p.status === 'In Progress' ||
        p.status === 'Site Inspected' ||
        p.status === 'Report Prepared',
    ).length,
    pendingPayment: valuationJobs.filter((p) => p.paymentStatus === 'Pending').length,
    pendingDocuments: valuationJobs.filter((p) => p.status === 'Awaiting Docs').length,
  };

  const recentValuationJobs = valuationJobs.slice(0, 5);

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
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard Overview</h1>
        <p style={subtitleStyle}>
          Welcome back, here's what's happening with your valuation jobs today.
        </p>
      </div>

      <div style={statsGridStyle}>
        <StatCard
          title="Total Valuation Jobs"
          value={stats.totalValuationJobs}
          icon={<FolderOutlined />}
          iconBgColor="#1890ff"
        />
        <StatCard
          title="Completed Valuation Jobs"
          value={stats.completedValuationJobs}
          icon={<CheckCircleOutlined />}
          iconBgColor="#52c41a"
        />
        <StatCard
          title="Active Valuation Jobs"
          value={stats.activeValuationJobs}
          icon={<FileTextOutlined />}
          iconBgColor="#13c2c2"
        />
        <StatCard
          title="Pending Payment"
          value={stats.pendingPayment}
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