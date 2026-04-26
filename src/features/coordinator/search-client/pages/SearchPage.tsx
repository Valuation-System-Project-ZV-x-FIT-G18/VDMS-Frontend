import { useState } from 'react';                    // state hook
import usePersistedState from '../../hooks/usePersistedState'; // persist form on refresh
import SearchModeToggle from '../components/SearchModeToggle'; // radio toggle
import type { SearchMode } from '../components/SearchModeToggle'; // mode type
import SearchBar from '../components/SearchBar';       // search input component
import ResultCard from '../components/ResultCard';     // found-result card
import NotFoundCard from '../components/NotFoundCard'; // not-found card
import { searchLoanApplicant } from '../api/search';   // API call helper
import type { SearchResult } from '../types/search';   // result type
import './SearchPage.css';                             // page styles
import '../responsive/search.responsive.css';

/* Coordinator search page — search by NIC or Project ID */
const SearchPage = () => {
  const [mode, setMode] = usePersistedState<SearchMode>('search-mode', 'nic'); // which field to search by
  const [loading, setLoading] = useState(false);      // tracks fetch state
  const [result, setResult] = useState<SearchResult | null>(null); // keep results in memory to avoid stale cached cards

  const handleSearch = async (query: string) => {
    setLoading(true);                                 // show loading indicator
    setResult(null);                                  // clear previous result
    try {
      const data = await searchLoanApplicant(query, mode);  // call backend API with search type
      setResult(data);                                // store result
    } catch {
      setResult({ found: false });                    // treat errors as not-found
    } finally {
      setLoading(false);                              // reset loading
    }
  };

  return (
    <div className="search-page">
      <h1 className="search-title">loan applicant — Search</h1>

      {/* Card wrapper for the search controls */}
      <div className="search-card">
        <SearchModeToggle mode={mode} onChange={setMode} /> {/* radio toggle */}
        <SearchBar onSearch={handleSearch} onInputChange={() => setResult(null)} loading={loading} mode={mode} />
      </div>

      <div className="search-results">
        {result && (result.found                      // conditionally render card
          ? <ResultCard data={result} />              // show applicant info
          : <NotFoundCard mode={mode} />               // show register prompt
        )}
      </div>
    </div>
  );
};

export default SearchPage;
