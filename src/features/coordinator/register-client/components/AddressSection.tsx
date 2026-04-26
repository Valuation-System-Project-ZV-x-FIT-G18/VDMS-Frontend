import type { RegisterFormData } from '../types/register';
import { districts } from '../../property-information/data/districts'; // district → province map
import FormField from './FormField';
import './AddressSection.css';

interface Props {
  form: RegisterFormData;
  onChange: (name: string, value: string) => void;
}

/* Unique province list derived from the districts array */
const provinces = [...new Set(districts.map(d => d.province))]; // removes duplicates

/* ADDRESS section — street, city, district dropdown, province dropdown, postal code */
const AddressSection = ({ form, onChange }: Props) => {
  /* When district changes, auto-fill the matching province */
  const handleDistrictChange = (value: string) => {
    onChange('district', value);                                    // update district field
    const match = districts.find(d => d.name === value);           // look up province
    if (match) onChange('province', match.province);                // auto-fill province
  };

  return (
    <div className="address-section">
      <span className="section-label">ADDRESS</span>
      <FormField label="Street address" name="streetAddress" value={form.streetAddress}
        onChange={onChange} placeholder="e.g. No.159, Big City Road, Rukmale" required />
      <div className="row">
        <FormField label="City" name="city" value={form.city}
          onChange={onChange} placeholder="e.g. Pannipitiya" required half />

        {/* District dropdown — selecting a district auto-fills province */}
        <div className="form-field half">
          <label className="field-label">District <span className="required">*</span></label>
          <select
            className="field-input"
            value={form.district}
            onChange={(e) => handleDistrictChange(e.target.value)}  // auto-fill province on change
          >
            <option value="">Select district</option>
            {districts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option> // one option per district
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        {/* Province dropdown — auto-filled by district, but still manually selectable */}
        <div className="form-field half">
          <label className="field-label">Province <span className="required">*</span></label>
          <select
            className="field-input"
            value={form.province}
            onChange={(e) => onChange('province', e.target.value)}  // allow manual override
          >
            <option value="">Select province</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>               // one option per province
            ))}
          </select>
        </div>
        <FormField label="Postal code" name="postalCode" value={form.postalCode}
          onChange={onChange} placeholder="e.g. 10230" half />
      </div>
    </div>
  );
};

export default AddressSection;
