import type { MenuItem } from './types/layout';
import { menuConfig } from './data/menu-config';
import SideBarMenu from './SideBarMenu';
import LogoutButton from './LogoutButton';

interface Props {
  items?: MenuItem[];              // role-specific menu items
  activePage?: string;
  onNavigate?: (page: string) => void;
  role?: string;
}

/* Full sidebar — main menu on top, settings + logout pinned at bottom */
const SideBar = ({ items, activePage, onNavigate, role }: Props) => {
  void activePage;
  void onNavigate;
  const resolvedItems = items ?? menuConfig[role || ''] ?? [];
  const topItems = resolvedItems.filter(i => i.position !== 'bottom');   // main nav items
  const bottomItems = resolvedItems.filter(i => i.position === 'bottom'); // e.g. Settings

  return (
    <aside className="sidebar">
      <SideBarMenu items={topItems} />     {/* scrollable main menu */}
      <div className="sidebar-bottom">
        <SideBarMenu items={bottomItems} /> {/* settings etc. above logout */}
        <LogoutButton />                    {/* logout always last */}
      </div>
    </aside>
  );
};

export default SideBar;
