import type { ProjectSummary } from '../types/project-summary';
import SummarySection from './SummarySection';
import SummaryField from './SummaryField';

interface Props { data: ProjectSummary['property']; } // property data from summary

/* Displays property details in a read-only section */
const PropertySection = ({ data }: Props) => {
  if (!data) return null;                              // skip if no data
  return (
    <SummarySection title="Property Details">
      <SummaryField label="Address" value={data.address} />
      <SummaryField label="City" value={data.city} />
      <SummaryField label="District" value={data.district} />
      <SummaryField label="Province" value={data.province} />
      <SummaryField label="Local Authority" value={data.local_authority} />
      <SummaryField label="Land Type" value={data.land_type} />
      <SummaryField label="Latitude" value={data.latitude} />
      <SummaryField label="Longitude" value={data.longitude} />
    </SummarySection>
  );
};

export default PropertySection;
