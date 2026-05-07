import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';
import SummaryField from './SummaryField';

interface Props {
  bank: ProjectSummary['bank'];                     // bank data
  officer: ProjectSummary['bankOfficer'];           // bank officer data
}

/* Displays bank + bank officer details in a read-only section */

const BankSection = ({ bank, officer }: Props) => {
  return (
    <SummarySection title="Bank & Officer Details">
      <SummaryField label="Bank Name" value={bank?.bank_name || 'Not provided'} />
      <SummaryField label="Branch" value={bank?.branch || 'Not provided'} />
      <SummaryField label="Branch Code" value={bank?.branch_code || 'Not provided'} />
      <SummaryField label="Officer Name" value={officer?.name || 'Not provided'} />
      <SummaryField label="Officer Email" value={officer?.email || 'Not provided'} />
      <SummaryField label="Officer Phone" value={officer?.phone || 'Not provided'} />
      <SummaryField label="Designation" value={officer?.designation || 'Not provided'} />
      {(!bank && !officer) && (
        <div style={{ color: '#b91c1c', marginTop: 8, fontSize: 13 }}>
          Bank and officer details are not available for this project.
        </div>
      )}
    </SummarySection>
  );
};

export default BankSection;
