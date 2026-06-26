import AppLogo from './AppLogo';
import RoleLabel from './RoleLabel';
import ProfileIcon from './ProfileIcon';

interface Props {
  role: string;                    // current user role to display
}

/* Top bar — spans the full width, shows logo on left, role + profile on right */
const TopBar = ({ role }: Props) => (
  <header className="topbar">
    <AppLogo />                    {/* brand/logo on the left */}
    <div className="topbar-right">
      <RoleLabel role={role} />    {/* role badge */}
      <ProfileIcon />              {/* profile avatar */}
    </div>
  </header>
);

export default TopBar;
