import React from 'react';

interface OnLeaveRowProps {
  officer: { name_with_initials: string; email: string; phone: string };
  leaveStart: string;
  leaveEnd: string;
}

const OnLeaveRow: React.FC<OnLeaveRowProps> = ({ officer, leaveStart, leaveEnd }) => (
  <tr>
    <td>{officer.name_with_initials}</td>
    <td>{officer.email}</td>
    <td>{officer.phone}</td>
    <td>{new Date(leaveStart).toLocaleDateString()}</td>
    <td>{new Date(leaveEnd).toLocaleDateString()}</td>
  </tr>
);

export default OnLeaveRow;
