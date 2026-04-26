import type { LegalFormData } from '../types/legal';
import FormField from '../../register-client/components/FormField';       // reusable input
import SelectField from '../../register-bank/components/SelectField';     // reusable dropdown
import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './DeedInfoSection.css';

interface Props {
  form: LegalFormData;
  onChange: (name: string, value: string) => void;
}

const deedTypes = ['Transfer', 'Gift', 'Lease', 'Partition', 'Mortgage']; // deed categories

/* DEED INFO section — deed number, deed type dropdown, registration date */
const DeedInfoSection = ({ form, onChange }: Props) => (
  <div className="deed-info-section">
    <SectionHeader icon="📜" title="Deed information" />
    <FormField label="Deed number" name="deedNumber" value={form.deedNumber}
      onChange={onChange} placeholder="e.g. 1234/2024" required />
    <div className="deed-row">
      <SelectField label="Deed type" name="deedType" value={form.deedType}
        onChange={onChange} options={deedTypes} placeholder="Select type" required />
      <FormField label="Registration date" name="registrationDate" value={form.registrationDate}
        onChange={onChange} type="date" required half />
    </div>
  </div>
);

export default DeedInfoSection;
