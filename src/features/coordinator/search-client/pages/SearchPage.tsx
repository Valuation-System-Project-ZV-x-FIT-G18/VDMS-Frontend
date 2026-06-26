import { useEffect, useState } from 'react';                    // state hook
import usePersistedState from '../../hooks/usePersistedState'; // persist form on refresh
import SearchModeToggle from '../components/SearchModeToggle'; // radio toggle
import type { SearchMode } from '../components/SearchModeToggle'; // mode type
import { COORDINATOR_RESET_EVENT } from '../../common/storage';
import SearchBar from '../components/SearchBar';       // search input component
import ResultCard from '../components/ResultCard';     // found-result card
import NotFoundCard from '../components/NotFoundCard'; // not-found card
import SearchEmptyState from '../components/SearchEmptyState'; // idle illustration
import { searchLoanApplicant } from '../api/search';   // API call helper
import type { SearchResult } from '../types/search';   // result type
import './SearchPage.css';                             // page styles
import '../responsive/search.responsive.css';

/* Coordinator search page — search by NIC or Project ID */
const SearchPage = () => {
  const [mode, setMode] = usePersistedState<SearchMode>('search-mode', 'nic'); // which field to search by
  const [loading, setLoading] = useState(false);      // tracks fetch state
  const [hasSearched, setHasSearched] = useState(false); // track if user has searched
  const [result, setResult] = useState<SearchResult | null>(null); // keep results in memory to avoid stale cached cards

  useEffect(() => {
    const handleCoordinatorReset = () => {
      setMode('nic');
      setHasSearched(false);
      setResult(null);
    };

    window.addEventListener(COORDINATOR_RESET_EVENT, handleCoordinatorReset);
    return () => window.removeEventListener(COORDINATOR_RESET_EVENT, handleCoordinatorReset);
  }, [setMode]);

  const handleSearch = async (query: string) => {
    setLoading(true);                                 // show loading indicator
    setHasSearched(true);
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
      <div className="search-hero">
        <h1 className="search-title">Applicant Search</h1>
        <p className="search-subtitle">Look up a loan applicant by NIC or Project ID.</p>
      </div>

      {/* Card wrapper for the search controls */}
      <div className="search-card">
        <SearchModeToggle mode={mode} onChange={setMode} /> {/* radio toggle */}
        <SearchBar onSearch={handleSearch} onInputChange={() => { setResult(null); setHasSearched(false); }} loading={loading} mode={mode} />
      </div>

      <div className="search-results">
        {!hasSearched && !loading && <SearchEmptyState />}
        {hasSearched && result && (result.found                      // conditionally render card
          ? <ResultCard data={result} />              // show applicant info
          : <NotFoundCard mode={mode} />               // show register prompt
        )}
      </div>
    </div>
  );
};

export default SearchPage;
