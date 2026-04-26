import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';
import SummaryField from './SummaryField';

interface Props { data: ProjectSummary['survey']; }  // survey data from summary

/* Displays survey plan details in a read-only section */
const SurveySection = ({ data }: Props) => {
  if (!data) return null;                             // skip if no data
  return (
    <SummarySection title="Survey Plan Details">
      <SummaryField label="Plan Number" value={data.plan_number} />
      <SummaryField label="Surveyor Name" value={data.surveyor_name} />
      <SummaryField label="Boundary Details" value={data.boundary_details} />
      <SummaryField label="Lot Number" value={data.lot_number} />
      <SummaryField label="Land Shape" value={data.land_shape} />
    </SummarySection>
  );
};

export default SurveySection;
