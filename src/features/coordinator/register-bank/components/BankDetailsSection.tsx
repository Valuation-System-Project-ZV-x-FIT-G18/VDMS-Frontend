import type { BankOfficerFormData } from '../types/bank-officer';
import SectionHeader from '../../register-client/components/SectionHeader'; // reuse
import './BankDetailsSection.css';

interface Props {
  form: BankOfficerFormData;
  onChange: (name: string, value: string) => void;
}

/* BANK DETAILS section — text inputs for bank name, branch, and branch code */
const BankDetailsSection = ({ form, onChange }: Props) => (
  <div className="bank-details-section">
    <SectionHeader icon="🏦" title="Bank details" />

    <div className="select-field">
      <label className="select-label">Bank name <span className="required">*</span></label>
      <input className="select-input" type="text" name="bankName" value={form.bankName}
        placeholder="e.g. Bank of Ceylon" onChange={(e) => onChange('bankName', e.target.value)} />
    </div>

    <div className="select-field">
      <label className="select-label">Branch <span className="required">*</span></label>
      <input className="select-input" type="text" name="branch" value={form.branch}
        placeholder="e.g. Colombo Fort" onChange={(e) => onChange('branch', e.target.value)} />
    </div>

    <div className="select-field">
      <label className="select-label">Branch code <span className="required">*</span></label>
      <input className="select-input" type="text" name="branchCode" value={form.branchCode}
        placeholder="e.g. 7010" onChange={(e) => onChange('branchCode', e.target.value)} />
    </div>
  </div>
);

export default BankDetailsSection;
