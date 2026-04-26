import type { SurveyFormData } from '../types/survey';
import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './BoundarySection.css';

interface Props {
  form: SurveyFormData;
  onChange: (name: string, value: string) => void;
  error?: string;
}

/* BOUNDARY section — textarea for boundary details */
const BoundarySection = ({ form, onChange, error }: Props) => (
  <div className="boundary-section">
    <SectionHeader icon="📐" title="Boundary details" />
    <label className="boundary-label">
      Description <span className="required">*</span>
    </label>
    <textarea
      className="boundary-textarea"
      name="boundaryDetails"
      value={form.boundaryDetails}
      onChange={(e) => onChange('boundaryDetails', e.target.value)} // notify parent
      placeholder="e.g. North: Road, South: Mr. Silva's land, East: Canal, West: Temple land"
      rows={4}
    />
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default BoundarySection;
