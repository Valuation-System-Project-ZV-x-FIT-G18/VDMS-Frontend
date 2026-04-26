import type { SurveyFormData } from '../types/survey';
import FormField from '../../register-client/components/FormField';       // reusable input
import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './PlanDetailsSection.css';

interface Props {
  form: SurveyFormData;
  onChange: (name: string, value: string) => void;
}

/* PLAN DETAILS section — plan number, surveyor name, lot number */
const PlanDetailsSection = ({ form, onChange }: Props) => (
  <div className="plan-details-section">
    <SectionHeader icon="📋" title="Plan details" />
    <FormField label="Survey plan number" name="planNumber" value={form.planNumber}
      onChange={onChange} placeholder="e.g. SP/2024/001" required />
    <div className="plan-row">
      <FormField label="Surveyor name" name="surveyorName" value={form.surveyorName}
        onChange={onChange} placeholder="e.g. K. Perera" required half />
      <FormField label="Lot number" name="lotNumber" value={form.lotNumber}
        onChange={onChange} placeholder="e.g. Lot 12A" required half />
    </div>
  </div>
);

export default PlanDetailsSection;
