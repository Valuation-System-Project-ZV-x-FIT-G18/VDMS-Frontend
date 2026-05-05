import type { SurveyFormData } from '../types/survey';
import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './BoundarySection.css';

interface Props {
  form: SurveyFormData;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

const sides: Array<{ key: keyof SurveyFormData; label: string; placeholder: string }> = [
  { key: 'northBoundary', label: 'North', placeholder: 'What is located on the North side?' },
  { key: 'southBoundary', label: 'South', placeholder: 'What is located on the South side?' },
  { key: 'eastBoundary', label: 'East', placeholder: 'What is located on the East side?' },
  { key: 'westBoundary', label: 'West', placeholder: 'What is located on the West side?' },
];

/* BOUNDARY section — dedicated inputs for each side of the property */
const BoundarySection = ({ form, onChange, errors = {} }: Props) => (
  <div className="boundary-section">
    <SectionHeader icon="📐" title="Boundary details" />
    <div className="boundary-grid">
      {sides.map((side) => (
        <div key={side.key} className="boundary-input-group">
          <label className="boundary-label">
            {side.label} <span className="required">*</span>
          </label>
          <textarea
            className="boundary-textarea"
            name={side.key}
            value={(form[side.key] as string) || ''}
            onChange={(e) => onChange(side.key, e.target.value)}
            placeholder={side.placeholder}
            rows={3}
          />
          {errors[side.key] && <span className="field-error">{errors[side.key]}</span>}
        </div>
      ))}
    </div>
  </div>
);

export default BoundarySection;
