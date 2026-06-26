import type { MenuItem } from './types/layout';
import SideBarItem from './SideBarItem';

interface Props {
  items: MenuItem[];               // list of menu items for the current role
}

/* Renders the list of sidebar menu items — mapped from the role config */
const SideBarMenu = ({ items }: Props) => (
  <nav className="sidebar-menu">
    {items.map(item => (
      <SideBarItem key={item.path} item={item} />         // one item per menu entry
    ))}
  </nav>
);

export default SideBarMenu;
