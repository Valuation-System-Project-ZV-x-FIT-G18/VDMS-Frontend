interface Props {
  label: string;                           // field name (e.g. "Full Name")
  value: string | number | undefined | null; // field value to display
}

/* Single read-only field row — label on left, value on right */
const SummaryField = ({ label, value }: Props) => (
  <div className="ps-field">
    <span className="ps-field-label">{label}</span>
    <span className="ps-field-value">{value ?? 'N/A'}</span>
  </div>
);

export default SummaryField;
