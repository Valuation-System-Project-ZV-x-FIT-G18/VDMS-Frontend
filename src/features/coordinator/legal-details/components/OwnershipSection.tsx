import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './OwnershipSection.css';

interface Props {
  value: string;                                          // current selection
  onChange: (name: string, value: string) => void;        // change handler
  error?: string;
}

const types = ['Single Owner', 'Joint Ownership'];        // ownership categories

/* OWNERSHIP section — radio buttons for ownership type */
const OwnershipSection = ({ value, onChange, error }: Props) => (
  <div className="ownership-section">
    <SectionHeader icon="👤" title="Ownership type" />
    <div className="ownership-options">
      {types.map(type => (
        <label key={type} className="ownership-option">
          <input type="radio" name="ownershipType" value={type}
            checked={value === type}                      /* highlight selected */
            onChange={() => onChange('ownershipType', type)} />
          {type}
        </label>
      ))}
    </div>
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default OwnershipSection;
