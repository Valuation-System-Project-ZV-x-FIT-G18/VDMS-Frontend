import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvailableTable from '../../available-to/components/AvailableTable';
import { fetchAllTechnicalOfficers } from '../../available-to/api/available';
import '../../available-to/pages/AvailableToPage.css';
import PageHeader from '../../available-to/components/PageHeader';

interface Officer {
  to_id: string;
  name_with_initials: string;
  email: string;
  phone: string;
}

const AllToPage: React.FC = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAllTechnicalOfficers();
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
        <PageHeader title="All technical officers" subtitle="Complete officer roster" />
        <button className="to-back-btn" onClick={() => navigate(-1)}>← Back</button>
        {error && <div className="error-message">{error}</div>}
        <AvailableTable officers={officers} loading={loading} />
      </div>
    </div>
  );
};

export default AllToPage;
