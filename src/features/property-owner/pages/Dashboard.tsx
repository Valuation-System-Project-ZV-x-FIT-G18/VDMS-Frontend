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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnerDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const clientId = localStorage.getItem('ownerClientId') || DEFAULT_OWNER_CLIENT_ID;
        const ownerProjects = await projectService.getAll({ clientId });
        setProjects(ownerProjects);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Owner dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerDashboardData();
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

  const stats = {
    totalProjects: projects.length,
    completedProjects: projects.filter((p) => p.status === 'Completed').length,
    activeProjects: projects.filter(
      (p) =>
        p.status === 'In Progress' ||
        p.status === 'Site Inspected' ||
        p.status === 'Report Prepared',
    ).length,
    pendingPayment: projects.filter((p) => p.paymentStatus === 'Pending').length,
    pendingDocuments: projects.filter((p) => p.status === 'Awaiting Docs').length,
  };

  const recentProjects = projects.slice(0, 5);

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
          welcome back, here's what's happening with your valuation job today
        </p>
      </div>

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