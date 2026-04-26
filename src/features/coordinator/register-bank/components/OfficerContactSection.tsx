import type { BankOfficerFormData } from '../types/bank-officer';
import FormField from '../../register-client/components/FormField'; // reuse
import './OfficerContactSection.css';

interface Props {
  form: BankOfficerFormData;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
}

/* IDENTITY & CONTACT section for the bank officer — NIC, designation, phone, email */
const OfficerContactSection = ({ form, onChange, errors = {} }: Props) => (
  <div className="officer-contact-section">
    <span className="section-label">IDENTITY &amp; CONTACT</span>
    <div className="row">
      <FormField label="NIC" name="nic" value={form.nic}
        onChange={onChange} placeholder="e.g. 200954762345" error={errors.nic} required half />
      <FormField label="Designation" name="designation" value={form.designation}
        onChange={onChange} placeholder="e.g. Branch Manager" error={errors.designation} half />
    </div>
    <div className="row">
      <FormField label="Contact number" name="phone" value={form.phone}
        onChange={onChange} placeholder="e.g. 0771234567" error={errors.phone} required half />
      <FormField label="Email" name="email" value={form.email}
        onChange={onChange} placeholder="e.g. officer@seylan.lk" type="email" error={errors.email} required half />
    </div>
  </div>
);

export default OfficerContactSection;
