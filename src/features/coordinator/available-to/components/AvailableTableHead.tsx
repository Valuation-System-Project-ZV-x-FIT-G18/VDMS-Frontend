/* Table header row for available officers table */
const AvailableTableHead = () => (
  <thead>
    <tr>
      <th>TO ID</th>              {/* technical officer ID */}
      <th>Name</th>               {/* full name */}
      <th>First name</th>
      <th>Last name</th>
      <th>Name with initials</th>
      <th>Email</th>
      <th>Phone</th>
      <th>NIC</th>                {/* national ID card */}
      <th>DOB</th>                {/* date of birth */}
    </tr>
  </thead>
);

export default AvailableTableHead;
