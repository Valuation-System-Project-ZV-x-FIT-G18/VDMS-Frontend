import type { BankOfficerFormData } from '../types/bank-officer';
import FormField from '../../register-client/components/FormField';   // reuse from register-client
import AutoField from '../../register-client/components/AutoField';   // reuse from register-client
import SectionHeader from '../../register-client/components/SectionHeader'; // reuse
import './OfficerNameSection.css';

interface Props {
  form: BankOfficerFormData;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

/* Bank officer NAME section — full name + auto-derived first, last, initials */
const OfficerNameSection = ({ form, onChange, errors = {} }: Props) => (
  <div className="officer-name-section">
    <SectionHeader icon="👤" title="Bank officer personal information" />
    <span className="section-label">NAME</span>
    <FormField
      label="Full name" name="fullName" value={form.fullName}
      onChange={onChange} placeholder="e.g. Sashini Nisansala Perera" error={errors.fullName} required
    />
    <div className="row">
      <AutoField label="First name" value={form.firstName} half />
      <AutoField label="Last name" value={form.lastName} half />
    </div>
    <AutoField label="Name with initials" value={form.nameWithInitials} />
  </div>
);

export default OfficerNameSection;
