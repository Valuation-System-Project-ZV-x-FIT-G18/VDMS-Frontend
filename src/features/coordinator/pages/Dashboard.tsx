import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 1,
      title: 'Create Project',
      description: 'Start a new valuation project',
      icon: '➕',
      color: '#1890ff',
      action: () => navigate('/coordinator/workflow/search'),
    },
    {
      id: 2,
      title: 'View Projects',
      description: 'See all ongoing projects',
      icon: '📄',
      color: '#52c41a',
      action: () => navigate('/coordinator/projects'),
    },
    {
      id: 3,
      title: 'Manage Clients',
      description: 'View and manage client information',
      icon: '👥',
      color: '#faad14',
      action: () => navigate('/coordinator/clients'),
    },
    {
      id: 4,
      title: 'Completed Projects',
      description: 'Review completed valuations',
      icon: '✅',
      color: '#52c41a',
      action: () => navigate('/coordinator/completed'),
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#262626' }}>
          Welcome, Coordinator
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>
          Manage projects and clients efficiently
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: 32,
        }}
      >
        {quickActions.map((action) => (
          <div
            key={action.id}
            onClick={action.action}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid #e8e8e8',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ marginBottom: 12, fontSize: 32 }}>{action.icon}</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: '#262626' }}>
              {action.title}
            </h3>
            <p style={{ margin: 0, color: '#888', fontSize: 13 }}>
              {action.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e8e8e8' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#262626' }}>
          Activity Summary
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#1890ff' }}>0</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Active Projects</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#52c41a' }}>0</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#faad14' }}>0</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Pending</div>
          </div>
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#f5222d' }}>0</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;





