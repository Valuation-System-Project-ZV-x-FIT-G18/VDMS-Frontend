interface Props {
  value: string;                                           // current textarea value
  onChange: (val: string) => void;                         // callback on text change
}

/* Text area for entering the purpose/reason of the valuation */
const PurposeInput = ({ value, onChange }: Props) => (
  <div className="nv-section">
    <h3 className="nv-section-title">Purpose of valuation</h3>
    <textarea
      className="nv-textarea"                              // styled via page CSS
      rows={4}                                             // 4-row text area
      placeholder="Enter the purpose of this valuation..." // placeholder hint
      value={value}
      onChange={e => onChange(e.target.value)}              // pass new text up
      required                                             // must not be empty
    />
  </div>
);

export default PurposeInput;
