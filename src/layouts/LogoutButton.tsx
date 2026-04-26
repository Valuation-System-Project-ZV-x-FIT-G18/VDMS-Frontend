import { useNavigate } from 'react-router-dom';

/* Logout button at the bottom of the sidebar — navigates back to role select */
const LogoutButton = () => {
  const navigate = useNavigate();

  return (
    <button className="sidebar-logout" onClick={() => navigate('/')}>
      🚪 <span>Logout</span>       {/* door emoji + text */}
    </button>
  );
};

export default LogoutButton;
