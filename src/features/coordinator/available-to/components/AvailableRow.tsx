import React from 'react';

interface AvailableRowProps {
  officer: {
    name_with_initials: string;
    name: string;
    city?: string;
    email: string;
    phone: string;
    nic: string;
  };
}

const AvailableRow: React.FC<AvailableRowProps> = ({ officer }) => (
  <tr>
    <td>{officer.name_with_initials}</td>
    <td>{officer.name}</td>
    <td>{officer.city || '-'}</td>
    <td>{officer.email}</td>
    <td>{officer.phone}</td>
    <td>{officer.nic}</td>
  </tr>
);

export default AvailableRow;
