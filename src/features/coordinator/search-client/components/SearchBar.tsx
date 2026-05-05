import { useEffect, useState } from 'react';
import usePersistedState from '../../hooks/usePersistedState'; // persist query on refresh
import type { SearchMode } from './SearchModeToggle'; // mode type for placeholder text
import { COORDINATOR_RESET_EVENT } from '../../common/storage';
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
  const [error, setError] = useState('');

  // dynamic placeholder based on selected search mode
  const placeholder = mode === 'nic' ? 'Enter NIC number' : 'Enter Project ID (e.g. pro001)';

  useEffect(() => {
    setError('');
  }, [mode]);

  useEffect(() => {
    const handleCoordinatorReset = () => {
      setQuery('');
      setError('');
      onInputChange?.();
    };

    window.addEventListener(COORDINATOR_RESET_EVENT, handleCoordinatorReset);
    return () => window.removeEventListener(COORDINATOR_RESET_EVENT, handleCoordinatorReset);
  }, [onInputChange]);

  const validateQuery = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Search value is required';
    }

    if (mode === 'nic' && !/^(\d{12}|\d{9}[Vv])$/.test(trimmed)) {
      return 'NIC must be 12 digits or 9 digits with V';
    }

    if (mode === 'project_id' && !/^pro\d{3}$/.test(trimmed)) {
      return 'Project ID must be like pro001';
    }

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();                        // prevent page reload on submit
    const validationError = validateQuery(query);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onSearch(query.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} noValidate>
      <div className="search-input-wrap">
        <input
          className="search-input"
          type="text"
          placeholder={placeholder}               // changes based on selected mode
          value={query}                          // binds to state
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError('');
            onInputChange?.();
          }} // update state + clear result
        />
        {error && <span className="search-error">{error}</span>}
      </div>
      <button className="search-btn" type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}  {/* show loading state */}
      </button>
    </form>
  );
};

export default SearchBar;
