import type { AssignedOfficer } from '../types/assigned-to';
import AssignedTableHead from './AssignedTableHead';
import AssignedTableRow from './AssignedTableRow';

interface Props {
  data: AssignedOfficer[];
}

const AssignedTable = ({ data }: Props) => {
  const rows = data.map(r => <AssignedTableRow key={r.id} row={r} />);
  return (
    <div className="to-table-scroll">
      <table className="to-table">
        <AssignedTableHead />
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default AssignedTable;
