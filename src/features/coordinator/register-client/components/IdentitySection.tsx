import type { RegisterFormData } from '../types/register';
import FormField from './FormField';
import './IdentitySection.css';

interface Props {
  form: RegisterFormData;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

/* IDENTITY & CONTACT section — NIC, DOB, phone, email, password fields */
const IdentitySection = ({ form, onChange, errors = {} }: Props) => (
  <div className="identity-section">
    <span className="section-label">IDENTITY &amp; CONTACT</span>
    <div className="row">
      <FormField label="NIC" name="nic" value={form.nic}
        onChange={onChange} placeholder="e.g. 123456789V" error={errors.nic} required half />
      <FormField label="Date of birth" name="dateOfBirth" value={form.dateOfBirth}
        onChange={onChange} type="date" error={errors.dateOfBirth} half />
    </div>
    <div className="row">
      <FormField label="Contact number" name="phone" value={form.phone}
        onChange={onChange} placeholder="e.g. 0761234567" error={errors.phone} required half />
      <FormField label="Email" name="email" value={form.email}
        onChange={onChange} placeholder="e.g. name@gmail.com" type="email" error={errors.email} required half />
    </div>
    <div className="row">
      <FormField label="Password" name="password" value={form.password}
        onChange={onChange} placeholder="Min 8 characters" type="password" error={errors.password} required half />
      <FormField label="Confirm password" name="confirmPassword" value={form.confirmPassword}
        onChange={onChange} placeholder="Re-enter password" type="password" error={errors.confirmPassword} required half />
    </div>
  </div>
);

export default IdentitySection;
