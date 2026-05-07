import type { FreeOfficerItem } from '../types/new-valuation';

interface Props {
  officers: FreeOfficerItem[];                             // list of available officers
  value: string;                                           // currently selected officer ID
  onChange: (toId: string) => void;                        // callback on selection change
  error?: string;
}

/* Dropdown to pick a technical officer from the FREE table */
const OfficerDropdown = ({ officers, value, onChange, error }: Props) => (
  <div className="nv-section">
    <h3 className="nv-section-title">Assign technical officer</h3>
    <select
      name="toId"
      className="nv-select"                                // styled via page CSS
      value={value}
      onChange={e => onChange(e.target.value)}              // pass selected ID up
      required                                             // must pick an officer
    >
      <option value="">-- Select officer --</option>       {/* default empty option */}
      {officers.map(o => (                                 // render each free officer
        <option key={o.to_id} value={o.to_id}>
          {o.name_with_initials} ({o.nic}) {/* show name + NIC */}
        </option>
      ))}
    </select>
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default OfficerDropdown;
