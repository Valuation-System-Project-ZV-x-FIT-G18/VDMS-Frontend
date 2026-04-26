import type { LegalFormData } from '../types/legal';
import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './NotarySection.css';

interface Props {
  form: LegalFormData;
  onChange: (name: string, value: string) => void;
  error?: string;
}

/* NOTARY section — textarea for notary name and details */
const NotarySection = ({ form, onChange, error }: Props) => (
  <div className="notary-section">
    <SectionHeader icon="🖊️" title="Notary details" />
    <label className="notary-label">
      Notary name & information <span className="required">*</span>
    </label>
    <textarea
      className="notary-textarea"
      name="notaryDetails"
      value={form.notaryDetails}
      onChange={(e) => onChange('notaryDetails', e.target.value)} // notify parent
      placeholder="e.g. Mr. A.B. Perera, Notary Public, Colombo"
      rows={3}
    />
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default NotarySection;
