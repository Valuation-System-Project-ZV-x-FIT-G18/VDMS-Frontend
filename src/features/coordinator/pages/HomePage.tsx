import { useNavigate } from 'react-router-dom'; // hook for programmatic navigation
import RoleButton from '../components/RoleButton'; // reusable button component
import { roles } from '../data/roles';             // all 7 role definitions
import './HomePage.css';                            // page-level styles

/* Landing page — renders a grid of role buttons */
const HomePage = () => {
  const navigate = useNavigate();                   // get navigation function

  const handleRoleClick = (id: string) => {
    if (id === 'coordinator') {
      navigate('/coordinator/search');               // coordinator goes to search page
    }
  };

  return (
    <div className="home-page">
      <h1 className="home-title">Valuation System</h1>
      <p className="home-subtitle">Select your role to continue</p>

      <div className="role-grid">
        {roles.map((role) => (
          <RoleButton key={role.id} role={role} onClick={handleRoleClick} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
