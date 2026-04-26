import { useNavigate } from 'react-router-dom'; // for navigation
import type { SearchMode } from './SearchModeToggle'; // mode type for dynamic message
import './NotFoundCard.css'; // scoped styles

interface Props {
  mode: SearchMode;                            // which search mode was used
}

/* Shown when the NIC or project ID doesn't match any loan applicant */
const NotFoundCard = ({ mode }: Props) => {
  const navigate = useNavigate();

  // pick the right label based on the search mode
  const label = mode === 'nic' ? 'NIC' : 'Project ID';

  return (
    <div className="not-found-card">
      <h3 className="not-found-title">No Results Found</h3>
      <p>The {label} you entered does not exist.</p>

      <button className="register-btn" onClick={() => navigate('/coordinator/register')}>
        Register Now
      </button>
    </div>
  );
};

export default NotFoundCard;
