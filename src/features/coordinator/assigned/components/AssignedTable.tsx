import React from 'react';
import OfficerRow from './OfficerRow';
import '../styles/assigned-table.css';

interface Assignment {
  id: number;
  officer: { name: string; email: string; phone: string; nic: string };
  time_date: string;
  project_id: string;
  property_address: string;
}

interface AssignedTableProps {
  assignments: Assignment[];
  loading?: boolean;
}

const AssignedTable: React.FC<AssignedTableProps> = ({ assignments, loading }) => {
  if (loading) return <div className="loading">Loading officers...</div>;
  if (!assignments.length) return <div className="no-data">No assigned officers found</div>;

  const rows = assignments.map((a, idx) => (
    <OfficerRow key={a.id} id={idx + 1} email={a.officer?.email || '-'} phone={a.officer?.phone || '-'} assignmentDate={a.time_date} projectId={a.project_id} propertyAddress={a.property_address} />
  ));

  return (
    <table className="assigned-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Phone</th>
          <th>Project ID</th>
          <th>Assignment Date</th>
          <th>Property Address</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default AssignedTable;
