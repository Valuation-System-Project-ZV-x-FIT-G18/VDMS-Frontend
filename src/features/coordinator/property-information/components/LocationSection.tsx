import type { PropertyFormData } from '../types/property';         // form shape
import FormField from '../../register-client/components/FormField'; // reusable input
import SelectField from '../../register-bank/components/SelectField'; // reusable dropdown
import SectionHeader from '../../register-client/components/SectionHeader'; // section title
import { districts } from '../data/districts';                      // district list
import './LocationSection.css';

interface Props {
  form: PropertyFormData;                                 // current form state
  onChange: (name: string, value: string) => void;        // change handler
  errors?: Record<string, string>;
}

const districtNames = districts.map(d => d.name);          // extract just the district names

/* PROPERTY LOCATION section — address, city, district dropdown, province (auto) */
const LocationSection = ({ form, onChange, errors = {} }: Props) => (
  <div className="location-section">
    <SectionHeader icon="📍" title="Property location" />
    <FormField label="Address" name="address" value={form.address}
      onChange={onChange} placeholder="e.g. No. 45, Temple Road" error={errors.address} required />
    <FormField label="City" name="city" value={form.city}
      onChange={onChange} placeholder="e.g. Pannipitiya" error={errors.city} required />
    <div className="location-row">
      <SelectField label="District" name="district" value={form.district}
        onChange={onChange} options={districtNames} placeholder="Select district" error={errors.district} required />
      <FormField label="Province" name="province" value={form.province}
        onChange={onChange} placeholder="Auto-filled" error={errors.province} required />
    </div>
  </div>
);

export default LocationSection;
