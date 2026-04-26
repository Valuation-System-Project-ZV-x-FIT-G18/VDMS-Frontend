import type { PropertyFormData } from '../types/property';         // form shape
import FormField from '../../register-client/components/FormField'; // reusable input
import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './LandTypeSection.css';

interface Props {
  form: PropertyFormData;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

const landTypes = ['Residential', 'Commercial', 'Agricultural'];   // 3 land categories

/* LAND & AUTHORITY section — local authority input + radio buttons for land type */
const LandTypeSection = ({ form, onChange, errors = {} }: Props) => (
  <div className="land-type-section">
    <SectionHeader icon="🏗️" title="Land & authority" />
    <FormField label="Local authority" name="localAuthority" value={form.localAuthority}
      onChange={onChange} placeholder="e.g. Pannipitiya Urban Council" error={errors.localAuthority} required />
    <label className="land-label">
      Land type <span className="required">*</span>
    </label>
    <div className="land-options">
      {landTypes.map(type => (
        <label key={type} className="land-option">
          <input type="radio" name="landType" value={type}
            checked={form.landType === type}               /* highlight selected */
            onChange={() => onChange('landType', type)} />  {/* update on click */}
          {type}
        </label>
      ))}
    </div>
    {errors.landType && <span className="field-error">{errors.landType}</span>}
  </div>
);

export default LandTypeSection;
