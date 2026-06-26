import type { AvailableOfficer } from '../types/available-to';

interface Props {
  row: AvailableOfficer;           // a single officer record
}

/* One table row displaying a technical officer's details */
const AvailableTableRow = ({ row }: Props) => (
  <tr>
    <td>{row.to_id}</td>               {/* officer ID */}
    <td>{row.name}</td>                {/* full name */}
    <td>{row.first_name}</td>          {/* first name */}
    <td>{row.last_name}</td>           {/* last name */}
    <td>{row.name_with_initials}</td>  {/* initials format */}
    <td>{row.email}</td>               {/* email */}
    <td>{row.phone}</td>               {/* phone */}
    <td>{row.nic}</td>                 {/* NIC number */}
    <td>{row.dob}</td>                 {/* date of birth */}
  </tr>
);

export default AvailableTableRow;
