import React from 'react';

interface AvailableRowProps {
  officer: { name_with_initials: string; email: string; phone: string };
  assignedProjects: number;
}

const AvailableRow: React.FC<AvailableRowProps> = ({ officer, assignedProjects }) => (
  <tr>
    <td>{officer.name_with_initials}</td>
    <td>{officer.email}</td>
    <td>{officer.phone}</td>
    <td><span className="badge">{assignedProjects}</span></td>
  </tr>
);

export default AvailableRow;
