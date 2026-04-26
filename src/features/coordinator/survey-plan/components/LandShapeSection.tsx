import SectionHeader from '../../register-client/components/SectionHeader'; // heading
import './LandShapeSection.css';

interface Props {
  value: string;                                          // current selection
  onChange: (name: string, value: string) => void;        // change handler
}

const shapes = ['Square', 'Rectangle', 'Circle', 'Irregular']; // land shape options

/* SHAPE OF LAND section — radio buttons for land shape */
const LandShapeSection = ({ value, onChange }: Props) => (
  <div className="land-shape-section">
    <SectionHeader icon="🔷" title="Shape of land" />
    <div className="shape-options">
      {shapes.map(shape => (
        <label key={shape} className="shape-option">
          <input type="radio" name="landShape" value={shape}
            checked={value === shape}                     /* highlight selected */
            onChange={() => onChange('landShape', shape)} />
          {shape}
        </label>
      ))}
    </div>
  </div>
);

export default LandShapeSection;
