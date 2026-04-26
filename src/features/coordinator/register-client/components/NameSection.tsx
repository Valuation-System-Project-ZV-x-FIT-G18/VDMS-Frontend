import type { RegisterFormData } from '../types/register';
import SectionHeader from './SectionHeader';
import FormField from './FormField';
import AutoField from './AutoField';
import './NameSection.css';

interface Props {
  form: RegisterFormData;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

/* NAME section — full name input + auto-derived first, last, initials */
const NameSection = ({ form, onChange, errors = {} }: Props) => (
  <div className="name-section">
    <SectionHeader icon="👤" title="Personal information" />
    <span className="section-label">NAME</span>
    <FormField
      label="Full name" name="fullName" value={form.fullName}
      onChange={onChange} placeholder="e.g. Chaminda Prasad Senarathne"
      error={errors.fullName}
      required hint="Enter complete name — first, middle and last"
    />
    <div className="row">
      <AutoField label="First name" value={form.firstName} half />
      <AutoField label="Last name" value={form.lastName} half />
    </div>
    <AutoField label="Name with initials" value={form.nameWithInitials} />
  </div>
);

export default NameSection;
