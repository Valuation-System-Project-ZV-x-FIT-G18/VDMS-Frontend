import './AutoField.css';

interface Props {
  label: string;   // field label
  value: string;   // auto-derived value
  half?: boolean;  // if true, takes 50% width
}

/* A read-only field with an "auto" badge — value is derived from full name */
const AutoField = ({ label, value, half }: Props) => (
  <div className={`auto-field ${half ? 'half' : ''}`}>
    <label className="auto-label">
      {label} <span className="auto-badge">auto</span>
    </label>
    <div className="auto-value">{value || '—'}</div>  {/* show dash if empty */}
  </div>
);

export default AutoField;
