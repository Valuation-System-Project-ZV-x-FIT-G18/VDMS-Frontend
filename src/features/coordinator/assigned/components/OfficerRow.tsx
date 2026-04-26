import React from 'react';

interface OfficerRowProps {
  id: number;
  email: string;
  phone: string;
  assignmentDate: string;
  projectId: string;
  propertyAddress: string;
}

const OfficerRow: React.FC<OfficerRowProps> = ({
  id,
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
      <td>{projectId}</td>
      <td>{new Date(assignmentDate).toLocaleDateString()}</td>
      <td>{propertyAddress || '-'}</td>
    </tr>
  );
};

export default OfficerRow;
