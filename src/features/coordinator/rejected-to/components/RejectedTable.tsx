import React from 'react';
import RejectedRow from './RejectedRow';
import '../styles/rejected-table.css';

interface Officer {
  to_id: string;
  name_with_initials: string;
  email: string;
  phone: string;
  rejection_date?: string;
  rejection_reason?: string;
}

interface RejectedTableProps {
  officers: Officer[];
  loading?: boolean;
}

const RejectedTable: React.FC<RejectedTableProps> = ({ officers, loading }) => {
  if (loading) return <div className="loading">Loading...</div>;
  if (!officers.length) return <div className="no-data">No rejected officers</div>;

  const rows = officers.map((o: any) => (
    <RejectedRow key={o.to_id} officer={o.officer || o} rejectionDate={o.rejection_date || ''} reason={o.reason_for_reject || ''} />
  ));

  return (
    <div className="rejected-table-scroll">
      <table className="rejected-table">
        <thead>
          <tr>
            <th>Officer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Rejection Date</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default RejectedTable;
