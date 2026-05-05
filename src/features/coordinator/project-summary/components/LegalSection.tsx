import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';
import SummaryField from './SummaryField';

interface Props { data: ProjectSummary['legal']; }   // legal data from summary

/* Displays legal details in a read-only section */
const LegalSection = ({ data }: Props) => {
  if (!data) return null;                             // skip if no data
  const regulations = data.usage_regulations?.filter(r => r?.trim()).join(' • ') || 'None specified';
  return (
    <SummarySection title="Legal Details">
      <SummaryField label="Deed Number" value={data.deed_number} />
      <SummaryField label="Deed Type" value={data.deed_type} />
      <SummaryField label="Registration Date" value={data.registration_date} />
      <SummaryField label="Notary Details" value={data.notary_details} />
      <SummaryField label="Ownership Type" value={data.ownership_type} />
      <SummaryField label="Usage Regulations" value={regulations} />
    </SummarySection>
  );
};

export default LegalSection;
