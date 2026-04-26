import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './RegulationsSection.css';

interface Props {
  selected: string[];                                     // currently checked items
  onToggle: (regulation: string) => void;                 // toggle a regulation on/off
}

const regulations = [
  'Environmental Restrictions',
  'Building Restrictions',
  'Zoning Restrictions',
  'Heritage Restrictions',
];

/* USAGE REGULATIONS section — checkboxes for restrictions */
const RegulationsSection = ({ selected, onToggle }: Props) => (
  <div className="regulations-section">
    <SectionHeader icon="⚖️" title="Usage regulations" />
    <div className="regulation-list">
      {regulations.map(reg => (
        <label key={reg} className="regulation-item">
          <input type="checkbox" checked={selected.includes(reg)}
            onChange={() => onToggle(reg)} />               {/* toggle on click */}
          {reg}
        </label>
      ))}
    </div>
  </div>
);

export default RegulationsSection;
