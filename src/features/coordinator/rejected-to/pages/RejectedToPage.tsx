import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RejectedTable from '../components/RejectedTable';
import { fetchRejectedOfficers } from '../api/rejected';
import '../../available-to/pages/AvailableToPage.css';
import '../styles/rejected-table.css';
import PageHeader from '../../available-to/components/PageHeader';

interface Officer {
  to_id: string;
  name_with_initials: string;
  email: string;
  phone: string;
  rejection_date?: string;
  rejection_reason?: string;
}

const RejectedToPage: React.FC = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchRejectedOfficers();
        setOfficers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="to-page">
      <div className="to-card">
        <PageHeader title="Rejected technical officers" subtitle="Assignments that require review or reassignment" />
        <button className="to-back-btn" onClick={() => navigate(-1)}>← Back</button>
        {error && <div className="error-message">{error}</div>}
        <RejectedTable officers={officers} loading={loading} />
      </div>
    </div>
  );
};

export default RejectedToPage;
