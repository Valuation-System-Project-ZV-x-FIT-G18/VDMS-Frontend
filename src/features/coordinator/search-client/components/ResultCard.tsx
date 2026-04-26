import { useNavigate } from 'react-router-dom';       // for navigation
import type { SearchResult } from '../types/search'; // result type
import './ResultCard.css';                             // scoped card styles

interface Props {
  data: SearchResult;                                 // the search result to display
}

/* Shows applicant details when found — name, NIC, email, project ID */
const ResultCard = ({ data }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="result-card">
      <h3 className="result-title">Applicant Found</h3>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>NIC:</strong> {data.nic}</p>
      <p><strong>Email:</strong> {data.email}</p>
      <p><strong>Project ID:</strong> {data.projectId ?? 'N/A'}</p>

      <button className="valuation-btn" onClick={() => navigate(`/coordinator/revaluation?nic=${data.nic}`)}>
        New Valuation
      </button>
    </div>
  );
};

export default ResultCard;
