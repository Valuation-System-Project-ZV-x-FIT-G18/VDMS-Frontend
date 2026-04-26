import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAssigned } from '../../assigned-to/api/assigned-to';
import { fetchAvailableOfficers, fetchAllTechnicalOfficers } from '../../available-to/api/available';
import { fetchOnLeaveOfficers } from '../../on-leave-to/api/on-leave';
import { fetchRejectedOfficers } from '../../rejected-to/api/rejected';
import SummaryStatCard from '../components/SummaryStatCard';
import WorkflowMiniCard from '../components/WorkflowMiniCard';
import QuickActionTile from '../components/QuickActionTile';
import './DashboardPage.css';

interface CoordinatorDashboardCounts {
  assigned: number;
  available: number;
  onLeave: number;
  rejected: number;
  allOfficers: number;
}

const zeroCounts: CoordinatorDashboardCounts = {
  assigned: 0,
  available: 0,
  onLeave: 0,
  rejected: 0,
  allOfficers: 0,
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<CoordinatorDashboardCounts>(zeroCounts);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [assignedRes, availableRes, onLeaveRes, rejectedRes, allRes] = await Promise.allSettled([
        fetchAssigned(),
        fetchAvailableOfficers(),
        fetchOnLeaveOfficers(),
        fetchRejectedOfficers(),
        fetchAllTechnicalOfficers(),
      ]);

      const toCount = (res: PromiseSettledResult<unknown>) => (
        res.status === 'fulfilled' && Array.isArray(res.value) ? res.value.length : 0
      );

      setCounts({
        assigned: toCount(assignedRes),
        available: toCount(availableRes),
        onLeave: toCount(onLeaveRes),
        rejected: toCount(rejectedRes),
        allOfficers: toCount(allRes),
      });

      setLoading(false);
    };

    void load();
  }, []);

  const utilization = useMemo(() => {
    if (counts.allOfficers === 0) return 0;
    return Math.round((counts.assigned / counts.allOfficers) * 100);
  }, [counts.assigned, counts.allOfficers]);

  const quickActions = [
    {
      icon: '📝',
      title: 'Start New Valuation',
      desc: 'Search applicant and continue workflow',
      route: '/coordinator/search',
    },
    {
      icon: '🚗',
      title: 'Open Fleet Board',
      desc: 'Assigned, available, all and rejected officers',
      route: '/coordinator/fleet-management',
    },
    {
      icon: '📌',
      title: 'Project Status',
      desc: 'Review summary before valuation assignment',
      route: '/coordinator/project-summary',
    },
  ];

  return (
    <div className="cd-page">
      <section className="cd-hero">
        <h1>Coordinator Dashboard</h1>
        <p>Quick view of valuation pipeline, officer availability, and next actions.</p>
      </section>

      <section className="cd-grid cd-grid--stats">
        <SummaryStatCard title="Total Officers" value={counts.allOfficers} note="Current fleet size" tone="blue" />
        <SummaryStatCard title="Assigned" value={counts.assigned} note="Active valuation assignments" tone="green" />
        <SummaryStatCard title="Available" value={counts.available} note="Ready for new valuation" tone="blue" />
        <SummaryStatCard title="On Leave" value={counts.onLeave} note="Temporarily unavailable" tone="amber" />
        <SummaryStatCard title="Rejected" value={counts.rejected} note="Needs review or rework" tone="red" />
      </section>

      <section className="cd-grid cd-grid--two">
        <article className="cd-panel">
          <div className="cd-panel__header">
            <h2>Workflow Health</h2>
            <span>{loading ? 'Updating...' : `${utilization}% utilized`}</span>
          </div>
          <div className="cd-workflow-list">
            <WorkflowMiniCard label="Assigned" value={counts.assigned} total={counts.allOfficers} colorClass="green" />
            <WorkflowMiniCard label="Available" value={counts.available} total={counts.allOfficers} colorClass="blue" />
            <WorkflowMiniCard label="On Leave" value={counts.onLeave} total={counts.allOfficers} colorClass="amber" />
            <WorkflowMiniCard label="Rejected" value={counts.rejected} total={counts.allOfficers} colorClass="red" />
          </div>
        </article>

        <article className="cd-panel">
          <div className="cd-panel__header">
            <h2>Quick Actions</h2>
            <span>Coordinator shortcuts</span>
          </div>
          <div className="cd-actions">
            {quickActions.map((action) => (
              <QuickActionTile
                key={action.title}
                icon={action.icon}
                title={action.title}
                desc={action.desc}
                onClick={() => navigate(action.route)}
              />
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default DashboardPage;
