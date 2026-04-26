import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AssignedOfficer } from '../types/assigned-to';
import { fetchAssigned } from '../api/assigned-to';
import PageHeader from '../../available-to/components/PageHeader';   // reuse shared header
import AssignedTable from '../components/AssignedTable';
import EmptyState from '../../available-to/components/EmptyState';   // reuse shared empty
import '../../available-to/pages/AvailableToPage.css';               // reuse shared table CSS

/* Assigned Technical Officers page — shows officers from the ASSIGNED_TO table */
const AssignedToPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AssignedOfficer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssigned()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="to-page">
      <div className="to-card">
        <PageHeader title="Assigned technical officers" subtitle="Officers currently assigned to valuations" />
        <button className="to-back-btn" onClick={() => navigate(-1)}>← Back</button>
        {loading ? <p>Loading...</p> :
          data.length === 0 ? <EmptyState message="No assigned officers found" /> :
          <AssignedTable data={data} />}
      </div>
    </div>
  );
};

export default AssignedToPage;
