import './SearchModeToggle.css';                       // scoped styles for radio group

export type SearchMode = 'nic' | 'project_id';        // the two search modes

interface Props {
  mode: SearchMode;                                    // currently selected mode
  onChange: (mode: SearchMode) => void;                // fires when user picks a mode
}

/* Radio-button toggle — lets user choose between NIC and Project ID search */
const SearchModeToggle = ({ mode, onChange }: Props) => (
  <div className="search-mode-toggle">
    <label className={`mode-option ${mode === 'nic' ? 'active' : ''}`}>
      <input
        type="radio"                                   // native radio for accessibility
        name="searchMode"                              // groups the two radios together
        checked={mode === 'nic'}                       // controlled by parent state
        onChange={() => onChange('nic')}                // notify parent on selection
      />
      Search by NIC                                    {/* label text */}
    </label>

    <label className={`mode-option ${mode === 'project_id' ? 'active' : ''}`}>
      <input
        type="radio"
        name="searchMode"
        checked={mode === 'project_id'}
        onChange={() => onChange('project_id')}
      />
      Search by Project ID
    </label>
  </div>
);

export default SearchModeToggle;
