import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuItem } from './types/layout';

interface Props {
  item: MenuItem;                  // single menu item to render
}

/* One clickable row in the sidebar — highlights when active */
const SideBarItem = ({ item }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();                      // current URL path
  const active = pathname === item.path;                   // check if this item is active

  return (
    <button
      className={`sidebar-item ${active ? 'sidebar-item--active' : ''}`}
      onClick={() => navigate(item.path)}                  // navigate on click
    >
      <span className="sidebar-icon">{item.icon}</span>    {/* emoji icon */}
      <span className="sidebar-label">{item.label}</span>  {/* menu text */}
    </button>
  );
};

export default SideBarItem;
