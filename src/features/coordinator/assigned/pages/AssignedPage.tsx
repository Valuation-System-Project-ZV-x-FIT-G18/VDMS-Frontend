import React, { useEffect, useState } from 'react';
import AssignedTable from '../components/AssignedTable';
import { fetchAssignedOfficers } from '../api/assigned';
import '../styles/assigned-page.css';

interface Assignment {
  id: number;
  valuation_id: number | null;
  officer: { name: string; email: string; phone: string; nic: string };
  time_date: string;
  project_id: string;
  property_address: string;
}

const AssignedPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAssignments = async () => {
      setLoading(true);
      try {
        const data = await fetchAssignedOfficers();
        setAssignments(data);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  return (
    <div className="assigned-page">
      <h1>Fleet Management - Assigned Technical Officers</h1>
      <div className="assigned-container">
        {error && <div className="error-message">{error}</div>}
        <AssignedTable assignments={assignments} loading={loading} />
      </div>
    </div>
  );
};

export default AssignedPage;
