import usePersistedState from '../../hooks/usePersistedState'; // persist query on refresh
import type { SearchMode } from './SearchModeToggle'; // mode type for placeholder text
import './SearchBar.css';                      // scoped search bar styles

interface Props {
  onSearch: (query: string) => void;           // callback triggered on search
  onInputChange?: () => void;                  // callback when user edits the input
  loading: boolean;                            // disables button while fetching
  mode: SearchMode;                            // current search mode for dynamic placeholder
}

/* Search input + button — lets user search by NIC or Project ID */
const SearchBar = ({ onSearch, onInputChange, loading, mode }: Props) => {
  const [query, setQuery] = usePersistedState('search-query', ''); // controlled input state

  // dynamic placeholder based on selected search mode
  const placeholder = mode === 'nic' ? 'Enter NIC number' : 'Enter Project ID (e.g. pro001)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();                        // prevent page reload on submit
    if (query.trim()) onSearch(query.trim());  // only search non-empty queries
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}               // changes based on selected mode
        value={query}                          // binds to state
        onChange={(e) => { setQuery(e.target.value); onInputChange?.(); }} // update state + clear result
      />
      <button className="search-btn" type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}  {/* show loading state */}
      </button>
    </form>
  );
};

export default SearchBar;
