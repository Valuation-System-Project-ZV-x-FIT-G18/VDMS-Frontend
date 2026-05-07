import './SearchEmptyState.css';

/* Shown on first load before any search is performed */
const SearchEmptyState = () => (
  <div className="ses-wrap">
    {/* Inline SVG — property + magnifying glass illustration */}
    <svg className="ses-illustration" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground shadow */}
      <ellipse cx="90" cy="152" rx="56" ry="7" fill="rgba(47,115,179,0.10)" />

      {/* Building body */}
      <rect x="38" y="80" width="100" height="72" rx="5" fill="#dce8f4" stroke="#a8c0d6" strokeWidth="1.5" />

      {/* Roof */}
      <polygon points="28,82 88,36 148,82" fill="#b8d0e8" stroke="#9bbfd6" strokeWidth="1.5" />

      {/* Chimney */}
      <rect x="116" y="42" width="12" height="22" rx="2" fill="#a8c0d6" />

      {/* Left window */}
      <rect x="50" y="92" width="26" height="22" rx="4" fill="#e8f3ff" stroke="#a8c0d6" strokeWidth="1" />
      <line x1="63" y1="92" x2="63" y2="114" stroke="#a8c0d6" strokeWidth="1" />
      <line x1="50" y1="103" x2="76" y2="103" stroke="#a8c0d6" strokeWidth="1" />

      {/* Right window */}
      <rect x="98" y="92" width="26" height="22" rx="4" fill="#e8f3ff" stroke="#a8c0d6" strokeWidth="1" />
      <line x1="111" y1="92" x2="111" y2="114" stroke="#a8c0d6" strokeWidth="1" />
      <line x1="98" y1="103" x2="124" y2="103" stroke="#a8c0d6" strokeWidth="1" />

      {/* Door */}
      <rect x="70" y="118" width="28" height="34" rx="4" fill="#8aafc9" />
      <circle cx="93" cy="136" r="2.5" fill="#dce8f4" />

      {/* Door step */}
      <rect x="65" y="150" width="38" height="5" rx="2" fill="#a8c0d6" />

      {/* Magnifying glass circle */}
      <circle cx="162" cy="58" r="28" fill="rgba(47,115,179,0.10)" stroke="#2f73b3" strokeWidth="5" />
      {/* Glass shine */}
      <circle cx="154" cy="50" r="5" fill="rgba(255,255,255,0.55)" />
      {/* Handle */}
      <line x1="182" y1="78" x2="200" y2="96" stroke="#2f73b3" strokeWidth="6" strokeLinecap="round" />

      {/* Small dots — decorative */}
      <circle cx="20" cy="100" r="4" fill="#b8d0e8" opacity="0.7" />
      <circle cx="14" cy="118" r="2.5" fill="#b8d0e8" opacity="0.5" />
      <circle cx="170" cy="130" r="3" fill="#b8d0e8" opacity="0.6" />
    </svg>

    <h2 className="ses-heading">Search for an Applicant</h2>
    <p className="ses-sub">Enter a NIC number or Project ID above to instantly look up a loan applicant.</p>

    <div className="ses-chips">
      <span className="ses-chip">🪪 NIC Lookup</span>
      <span className="ses-chip">📁 Project ID</span>
      <span className="ses-chip">⚡ Instant Results</span>
    </div>
  </div>
);

export default SearchEmptyState;
