import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';
import SummaryField from './SummaryField';

interface Props {
  bank: ProjectSummary['bank'];                     // bank data
  officer: ProjectSummary['bankOfficer'];           // bank officer data
}

/* Displays bank + bank officer details in a read-only section */
const BankSection = ({ bank, officer }: Props) => {
  if (!bank && !officer) return null;                // skip if no data
  return (
    <SummarySection title="Bank & Officer Details">
      <SummaryField label="Bank Name" value={bank?.bank_name} />
      <SummaryField label="Branches" value={bank?.branches?.join(', ')} />
      <SummaryField label="Officer Name" value={officer?.name} />
      <SummaryField label="Officer Email" value={officer?.email} />
      <SummaryField label="Officer Phone" value={officer?.phone} />
      <SummaryField label="Branch" value={officer?.branch} />
      <SummaryField label="Designation" value={officer?.designation} />
    </SummarySection>
  );
};

export default BankSection;
