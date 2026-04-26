/* Table header row for rejected officers — includes action column */
const RejectedTableHead = () => (
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
      <th>Reason for reject</th>   {/* why the valuation was rejected */}
      <th>Actions</th>             {/* OK / Decline buttons */}
    </tr>
  </thead>
);

export default RejectedTableHead;
