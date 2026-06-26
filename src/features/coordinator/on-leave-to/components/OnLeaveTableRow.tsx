import type { OnLeaveOfficer } from '../types/on-leave-to';

interface Props {
  row: OnLeaveOfficer;             // a single on-leave officer record
}

/* One table row displaying an on-leave officer + leave dates */
const OnLeaveTableRow = ({ row }: Props) => (
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
    <td>{row.reason_for_leave}</td>            {/* leave reason */}
    <td>{row.date_from}</td>                   {/* leave start */}
    <td>{row.date_to}</td>                     {/* leave end */}
  </tr>
);

export default OnLeaveTableRow;
