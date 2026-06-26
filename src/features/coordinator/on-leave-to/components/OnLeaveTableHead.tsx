/* Table header row for on-leave officers — includes leave-specific columns */
const OnLeaveTableHead = () => (
  <thead>
    <tr>
      <th>TO ID</th>
      <th>Name</th>
      <th>First name</th>
      <th>Last name</th>
      <th>Name with initials</th>
      <th>Email</th>
      <th>Phone</th>
      <th>NIC</th>
      <th>DOB</th>
      <th>Reason for leave</th>    {/* why the officer is on leave */}
      <th>From</th>                {/* leave start date */}
      <th>To</th>                  {/* leave end date */}
    </tr>
  </thead>
);

export default OnLeaveTableHead;
