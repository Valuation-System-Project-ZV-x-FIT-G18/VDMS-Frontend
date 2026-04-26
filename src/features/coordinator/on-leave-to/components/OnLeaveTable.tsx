import React from 'react';
import OnLeaveRow from './OnLeaveRow';
import '../styles/onleave-table.css';

interface Officer {
  to_id: string;
  name_with_initials: string;
  email: string;
  phone: string;
  leave_start?: string;
  leave_end?: string;
}

interface OnLeaveTableProps {
  officers: Officer[];
  loading?: boolean;
}

const OnLeaveTable: React.FC<OnLeaveTableProps> = ({ officers, loading }) => {
  if (loading) return <div className="loading">Loading...</div>;
  if (!officers.length) return <div className="no-data">No officers on leave</div>;

  const rows = officers.map((o: any) => (
    <OnLeaveRow key={o.to_id} officer={o.officer || o} leaveStart={o.date_from || ''} leaveEnd={o.date_to || ''} />
  ));

  return (
    <table className="onleave-table">
      <thead>
        <tr>
          <th>Officer</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Leave Start</th>
          <th>Leave End</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default OnLeaveTable;
