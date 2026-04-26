import './FormField.css';

interface Props {
  label: string;               // field label text
  name: string;                // input name attribute
  value: string;               // controlled input value
  onChange: (name: string, value: string) => void; // change handler
  placeholder?: string;        // placeholder text
  type?: string;               // input type (text, email, password, date)
  required?: boolean;          // shows red asterisk
  hint?: string;               // helper text below input
  half?: boolean;              // if true, takes 50% width in a row
}

/* A single labelled form input — reused across all sections */
const FormField = ({ label, name, value, onChange, placeholder, type = 'text', required, hint, half }: Props) => (
  <div className={`form-field ${half ? 'half' : ''}`}>
    <label className="field-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      className="field-input"
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(name, e.target.value)}   // notify parent of change
    />
    {hint && <span className="field-hint">{hint}</span>} {/* optional helper text */}
  </div>
);

export default FormField;
