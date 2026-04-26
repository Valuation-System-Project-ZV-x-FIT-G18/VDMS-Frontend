import type { AssignedOfficer } from '../types/assigned-to';

interface Props {
  row: AssignedOfficer;
}

const AssignedTableRow = ({ row }: Props) => {
  const dt = new Date(row.time_date);
  const date = dt.toLocaleDateString();
  const time = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <tr>
      <td>{row.officer.name_with_initials}</td>
      <td>{row.officer.email}</td>
      <td>{row.officer.phone}</td>
      <td>{row.officer.nic}</td>
      <td>{row.project_id}</td>
      <td>{row.loan_applicant_nic}</td>
      <td>{date}</td>
      <td>{time}</td>
      <td>{row.property_address}</td>
    </tr>
  );
};

export default AssignedTableRow;
