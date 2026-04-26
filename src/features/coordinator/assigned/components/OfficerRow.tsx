import React from 'react';

interface OfficerRowProps {
  id: number;
  valuationId: number | null;
  email: string;
  phone: string;
  assignmentDate: string;
  projectId: string;
  propertyAddress: string;
}

const OfficerRow: React.FC<OfficerRowProps> = ({
  id,
  valuationId,
  email,
  phone,
  assignmentDate,
  projectId,
  propertyAddress,
}) => {
  return (
    <tr key={id}>
      <td>{email}</td>
      <td>{phone}</td>
      <td>{valuationId ?? '-'}</td>
      <td>{projectId}</td>
      <td>{new Date(assignmentDate).toLocaleDateString()}</td>
      <td>{propertyAddress || '-'}</td>
    </tr>
  );
};

export default OfficerRow;
