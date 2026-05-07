interface Props {
  value: string;                                           // current project ID value
  onChange: (val: string) => void;                         // callback when value changes
}

/* Input field for entering the project ID this valuation is linked to */
const ProjectIdInput = ({ value, onChange }: Props) => (
  <div className="nv-section">
    <h3 className="nv-section-title">Project ID</h3>
    <input
      type="text"                                          // plain text input
      className="nv-input"
      placeholder="e.g. pro001"                            // hint for expected format
      value={value}
      onChange={e => onChange(e.target.value)}              // pass new value up
      required                                             // cannot be empty
    />
  </div>
);

export default ProjectIdInput;
