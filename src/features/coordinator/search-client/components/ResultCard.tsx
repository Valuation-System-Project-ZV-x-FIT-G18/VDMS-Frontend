import { useNavigate } from 'react-router-dom';       // for navigation
import type { SearchResult } from '../types/search'; // result type
import './ResultCard.css';                             // scoped card styles

interface Props {
  data: SearchResult;                                 // the search result to display
}

/* Shows applicant details when found — name, NIC, email, project ID */
const ResultCard = ({ data }: Props) => {
  const navigate = useNavigate();

  // Avatar letter from first character of name
  const avatarLetter = data.name ? data.name.charAt(0).toUpperCase() : '?';

  const fields = [
    { icon: '🪪', label: 'NIC',        value: data.nic       ?? '—' },
    { icon: '📧', label: 'Email',      value: data.email     ?? '—' },
    { icon: '📁', label: 'Project ID', value: data.projectId ?? 'Not assigned' },
  ];

  return (
    <div className="result-card">
      {/* Found badge */}
      <div className="result-badge">✔ Applicant Found</div>

      {/* Avatar + name */}
      <div className="result-identity">
        <div className="result-avatar">{avatarLetter}</div>
        <div>
          <p className="result-name">{data.name}</p>
          <p className="result-name-sub">Loan Applicant</p>
        </div>
      </div>

      {/* Divider */}
      <div className="result-divider" />

      {/* Field rows */}
      <div className="result-fields">
        {fields.map(f => (
          <div key={f.label} className="result-field-row">
            <span className="result-field-icon">{f.icon}</span>
            <span className="result-field-label">{f.label}</span>
            <span className="result-field-value">{f.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="result-actions">
        <button className="valuation-btn" onClick={() => navigate(`/coordinator/revaluation?nic=${data.nic}`)}>New Valuation</button>
      </div>
    </div>
  );
};

export default ResultCard;
