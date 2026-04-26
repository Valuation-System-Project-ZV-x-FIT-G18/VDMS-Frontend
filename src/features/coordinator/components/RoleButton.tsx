import type { Role } from '../types'; // import the Role type for type-safety
import './RoleButton.css';             // scoped styles for this button

interface Props {
  role: Role;                          // the role data to display
  onClick: (id: string) => void;       // callback when the button is clicked
}

/* A single role-selection button — kept under 20 lines */
const RoleButton = ({ role, onClick }: Props) => {
  return (
    <button
      className="role-button"                               // base class for all role buttons
      style={{ backgroundColor: role.color }}                // dynamic colour per role
      onClick={() => onClick(role.id)}                       // fires parent handler with role id
    >
      {role.label}                                           {/* visible button text */}
    </button>
  );
};

export default RoleButton;
