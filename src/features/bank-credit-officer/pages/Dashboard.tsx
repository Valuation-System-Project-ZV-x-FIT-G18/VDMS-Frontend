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

const DashboardPage = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // ✅ NEW: State for API data
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    pendingPayments: 0,
    pendingDocuments: 0,
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ NEW: Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, projectsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentProjects(5),
        ]);

        setStats(statsData);
        setRecentProjects(projectsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (selectedProject) {
    return (
      <ValuationJobDetail 
        projectId={selectedProject.id} 
        initialProject={selectedProject}
        onBack={() => setSelectedProject(null)} 
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
          welcome back, here's what's happening with your valuation job today
        </p>
      </div>

      {/* Stats Cards - ✅ Using REAL data from backend */}
      <div style={statsGridStyle}>
        <StatCard
          title="Total Project"
          value={stats.totalProjects}
          icon={<FolderOutlined />}
          iconBgColor="#1890ff"
        />
        <StatCard
          title="Completed Project"
          value={stats.completedProjects}
          icon={<CheckCircleOutlined />}
          iconBgColor="#52c41a"
        />
        <StatCard
          title="Active Project"
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
          title="Pending Document"
          value={stats.pendingDocuments}
          icon={<FileOutlined />}
          iconBgColor="#fa8c16"
        />
      </div>

      {/* Projects Table - ✅ Using REAL data from backend */}
      <ProjectsTable 
        projects={recentProjects} 
        showSearch 
        onProjectClick={(projectId) => {
          const selected = recentProjects.find(
            (project) => project.id === projectId || project.projectId === projectId,
          );
          if (selected) {
            setSelectedProject(selected);
          }
        }}
      />
    </div>
  );
};

export default DashboardPage;