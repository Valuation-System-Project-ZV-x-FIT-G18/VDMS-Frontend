interface Props {
  label: string;
  value: string | number | null | undefined;
}

const FieldRow = ({ label, value }: Props) => (
  <div className="rv-row">
    <span className="rv-label">{label}</span>
    <span className="rv-value">{value || '-'}</span>
  </div>
);

export default FieldRow;
