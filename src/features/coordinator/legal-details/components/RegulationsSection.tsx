import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './RegulationsSection.css';

interface Props {
  regulations: string[];                                  // array of 4 text restrictions
  onChange: (index: number, value: string) => void;      // update specific regulation text
  error?: string;
}

const regulationLabels = [
  'Environmental Restrictions',
  'Building Restrictions',
  'Zoning Restrictions',
  'Heritage Restrictions',
];

/* USAGE REGULATIONS section — 4 text areas for detailed restrictions (min 100 words each) */
const RegulationsSection = ({ regulations, onChange, error }: Props) => (
  <div className="regulations-section">
    <SectionHeader icon="⚖️" title="Usage regulations" />
    <div className="regulation-inputs">
      {regulationLabels.map((label, index) => (
        <div key={index} className="regulation-input-group">
          <label className="regulation-label">{label}</label>
          <textarea
             className="regulation-textarea"
             name="usageRegulations"
            placeholder="Enter detailed restrictions..."
            rows={6}
            value={regulations[index] || ''}
            onChange={(e) => onChange(index, e.target.value)}
          />
          <span className="regulation-hint">
            Word count: {(regulations[index] || '').split(/\s+/).filter(w => w.length > 0).length} / ~100 words
          </span>
        </div>
      ))}
    </div>
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default RegulationsSection;
