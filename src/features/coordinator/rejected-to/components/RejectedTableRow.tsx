import type { RejectedOfficer } from '../types/rejected-to';

interface Props {
  row: RejectedOfficer;                                    // a single rejected record
  onOk: (id: number) => void;                              // fires when OK is clicked
  onDecline: (id: number) => void;                         // fires when Decline is clicked
}

/* One table row for a rejected officer — with OK and Decline action buttons */
const RejectedTableRow = ({ row, onOk, onDecline }: Props) => (
  <tr>
    <td>{row.officer.to_id}</td>
    <td>{row.officer.name}</td>
    <td>{row.officer.first_name}</td>
    <td>{row.officer.last_name}</td>
    <td>{row.officer.name_with_initials}</td>
    <td>{row.officer.email}</td>
    <td>{row.officer.phone}</td>
    <td>{row.officer.nic}</td>
    <td>{row.officer.dob}</td>
    <td>{row.reason_for_reject}</td>                       {/* rejection reason */}
    <td>
      <button className="to-ok-btn" onClick={() => onOk(row.id)}>OK</button>
      <button className="to-decline-btn" onClick={() => onDecline(row.id)}>Decline</button>
    </td>
  </tr>
);

export default RejectedTableRow;
