import React from 'react';
import AvailableRow from './AvailableRow';
import '../styles/available-table.css';

interface Officer {
  to_id: string;
  name_with_initials: string;
  email: string;
  phone: string;
}

interface AvailableTableProps {
  officers: Officer[];
  loading?: boolean;
}

const AvailableTable: React.FC<AvailableTableProps> = ({ officers, loading }) => {
  if (loading) return <div className="loading">Loading...</div>;
  if (!officers.length) return <div className="no-data">No available officers</div>;

  const rows = officers.map((o: any) => (
    <AvailableRow key={o.to_id} officer={o.officer || o} assignedProjects={0} />
  ));

  return (
    <div className="available-table-scroll">
      <table className="available-table">
        <thead>
          <tr>
            <th>Officer</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Active Projects</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default AvailableTable;
