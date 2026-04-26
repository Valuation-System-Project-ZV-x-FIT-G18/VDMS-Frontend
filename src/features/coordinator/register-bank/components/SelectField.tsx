import './SelectField.css';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options: string[];           // list of option strings
  placeholder: string;         // e.g. "Select bank"
  required?: boolean;
  error?: string;
}

/* A dropdown select field — reusable for bank name and branch */
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: Props) => (
  <div className="select-field">
    <label className="select-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <select
      className="select-input"
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}  // notify parent
    >
      <option value="">{placeholder}</option>           {/* default empty option */}
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>   /* one option per item */
      ))}
    </select>
    {error && <span className="select-error">{error}</span>}
  </div>
);

export default SelectField;
