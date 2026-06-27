import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import valuationJobService from '../../../services/valuationJobService';
import type { ValuationJob, JobStats } from '../../../services/valuationJobService';

const CoordinatorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<JobStats>({
    totalProjects: 0,
    completedProjects: 0,
    activeProjects: 0,
    pendingPayment: 0,
    pendingDocuments: 0,
  });
  const [recentJobs, setRecentJobs] = useState<ValuationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsData, jobsData] = await Promise.all([
          valuationJobService.getStats(),
          valuationJobService.getJobs(),
        ]);
        setStats(statsData);
        setRecentJobs(jobsData.slice(0, 5)); // show latest 5
      } catch (err: any) {
        setError('Could not load data. Please check your connection.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      id: 1,
      title: 'Create Project',
      description: 'Start a new valuation project',
      icon: '➕',
      color: '#1890ff',
      bg: '#e6f4ff',
      action: () => navigate('/coordinator/workflow/search'),
    },
    {
      id: 2,
      title: 'View Projects',
      description: 'See all ongoing projects',
      icon: '📄',
      color: '#52c41a',
      bg: '#f6ffed',
      action: () => navigate('/coordinator/projects'),
    },
    {
      id: 3,
      title: 'Fleet Management',
      description: 'Manage vehicles and staff',
      icon: '🚗',
      color: '#faad14',
      bg: '#fffbe6',
      action: () => navigate('/coordinator/fleet'),
    },
    {
      id: 4,
      title: 'Messages',
      description: 'View communications',
      icon: '💬',
      color: '#722ed1',
      bg: '#f9f0ff',
      action: () => navigate('/coordinator/messages'),
    },
  ];

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, color: '#1890ff', icon: '📁' },
    { label: 'Active', value: stats.activeProjects, color: '#52c41a', icon: '🔄' },
    { label: 'Completed', value: stats.completedProjects, color: '#13c2c2', icon: '✅' },
    { label: 'Pending Payment', value: stats.pendingPayment, color: '#faad14', icon: '💳' },
    { label: 'Pending Docs', value: stats.pendingDocuments, color: '#f5222d', icon: '📋' },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { bg: '#f6ffed', text: '#52c41a' };
      case 'in_progress':
      case 'in progress': return { bg: '#e6f4ff', text: '#1890ff' };
      case 'awaiting_docs':
      case 'pending': return { bg: '#fffbe6', text: '#faad14' };
      case 'cancelled': return { bg: '#fff2f0', text: '#f5222d' };
      default: return { bg: '#f5f5f5', text: '#666' };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>
          Coordinator Dashboard
        </h1>
        <p style={{ margin: '6px 0 0 0', color: '#888', fontSize: 14 }}>
          Overview of all valuation projects and activities
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          marginBottom: 20, padding: '12px 16px',
          backgroundColor: '#fff2f0', border: '1px solid #ffccc7',
          borderRadius: 8, color: '#cf1322', fontSize: 14,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 16,
        marginBottom: 28,
      }}>
        {statCards.map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: '#fff',
            padding: '20px 16px',
            borderRadius: 12,
            border: '1px solid #f0f0f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ fontSize: 24 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color, lineHeight: 1 }}>
              {loading ? (
                <span style={{
                  display: 'inline-block', width: 40, height: 28,
                  background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: 4,
                }} />
              ) : stat.value}
            </div>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#262626' }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
        }}>
          {quickActions.map((action) => (
            <div
              key={action.id}
              onClick={action.action}
              style={{
                backgroundColor: '#fff',
                padding: '18px 20px',
                borderRadius: 12,
                cursor: 'pointer',
                border: `1px solid #f0f0f0`,
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.10)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#f0f0f0';
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                backgroundColor: action.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {action.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>
                  {action.title}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  {action.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects Table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#262626' }}>
            Recent Projects
          </h2>
          <button
            onClick={() => navigate('/coordinator/projects')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#1890ff', fontSize: 13, fontWeight: 500,
            }}
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#aaa' }}>
            <div style={{
              display: 'inline-block', width: 28, height: 28,
              border: '3px solid #f0f0f0', borderTopColor: '#1890ff',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{ marginTop: 12, fontSize: 13 }}>Loading projects...</div>
          </div>
        ) : recentJobs.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#aaa' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#555' }}>No projects yet</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Click <strong>Create Project</strong> to start a new valuation
            </div>
            <button
              onClick={() => navigate('/coordinator/workflow/search')}
              style={{
                marginTop: 16, padding: '10px 24px',
                backgroundColor: '#1890ff', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontSize: 14, fontWeight: 500,
              }}
            >
              ➕ Create Project
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  {['Project ID', 'Property Address', 'Applicants', 'Requested Date', 'Status', 'Payment'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600, color: '#888',
                      borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job, idx) => {
                  const sc = getStatusColor(job.status);
                  return (
                    <tr
                      key={job.id}
                      style={{
                        backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f7ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fff' : '#fafafa'; }}
                    >
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#1890ff', fontWeight: 500 }}>
                        #{job.projectId || job.id?.slice(0, 8)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#333', maxWidth: 200 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.propertyAddress || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>
                        {Array.isArray(job.applicants) ? job.applicants.join(', ') : job.applicants || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}>
                        {formatDate(job.requestedDate)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20,
                          fontSize: 12, fontWeight: 500,
                          backgroundColor: sc.bg, color: sc.text,
                        }}>
                          {job.status?.replace('_', ' ') || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20,
                          fontSize: 12, fontWeight: 500,
                          backgroundColor: job.paymentStatus === 'Paid' ? '#f6ffed' : '#fffbe6',
                          color: job.paymentStatus === 'Paid' ? '#52c41a' : '#faad14',
                        }}>
                          {job.paymentStatus || '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CoordinatorDashboard;
