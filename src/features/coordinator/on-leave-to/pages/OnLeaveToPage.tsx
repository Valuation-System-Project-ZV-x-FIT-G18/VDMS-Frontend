import React, { useEffect, useState } from 'react';
import OnLeaveTable from '../components/OnLeaveTable';
import { fetchOnLeaveOfficers } from '../api/on-leave';
import '../styles/onleave-page.css';

interface Officer {
  to_id: string;
  name_with_initials: string;
  email: string;
  phone: string;
  leave_start?: string;
  leave_end?: string;
}

const OnLeaveToPage: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchOnLeaveOfficers();
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
    <div className="onleave-page">
      <h1>Technical Officers on Leave</h1>
      <div className="onleave-container">
        {error && <div className="error-message">{error}</div>}
        <OnLeaveTable officers={officers} loading={loading} />
      </div>
    </div>
  );
};

export default OnLeaveToPage;
