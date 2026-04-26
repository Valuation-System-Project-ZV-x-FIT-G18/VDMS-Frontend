import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';
import SummaryField from './SummaryField';

interface Props { data: ProjectSummary['client']; }  // client data from summary

/* Displays client/applicant details in a read-only section */
const ClientSection = ({ data }: Props) => {
  if (!data) return null;                             // skip if no data
  return (
    <SummarySection title="Client Details">
      <SummaryField label="Full Name" value={data.full_name} />
      <SummaryField label="NIC" value={data.nic} />
      <SummaryField label="Email" value={data.email} />
      <SummaryField label="Phone" value={data.phone} />
      <SummaryField label="Date of Birth" value={data.date_of_birth} />
      <SummaryField label="Address" value={data.street_address} />
      <SummaryField label="City" value={data.city} />
      <SummaryField label="District" value={data.district} />
      <SummaryField label="Province" value={data.province} />
      <SummaryField label="Postal Code" value={data.postal_code} />
    </SummarySection>
  );
};

export default ClientSection;
