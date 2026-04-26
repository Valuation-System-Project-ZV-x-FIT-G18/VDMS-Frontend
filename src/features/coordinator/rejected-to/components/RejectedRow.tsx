import React from 'react';

interface RejectedRowProps {
  officer: { name_with_initials: string; email: string; phone: string };
  rejectionDate: string;
  reason: string;
}

const RejectedRow: React.FC<RejectedRowProps> = ({ officer, rejectionDate, reason }) => (
  <tr>
    <td>{officer.name_with_initials}</td>
    <td>{officer.email}</td>
    <td>{officer.phone}</td>
    <td>{new Date(rejectionDate).toLocaleDateString()}</td>
    <td>{reason || '-'}</td>
  </tr>
);

export default RejectedRow;
