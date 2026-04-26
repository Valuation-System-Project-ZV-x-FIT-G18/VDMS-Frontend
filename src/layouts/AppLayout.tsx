import type { ReactNode } from 'react';
import TopBar from './TopBar';
import SideBar from './Sidebar';
import { menuConfig } from './data/menu-config';
import './AppLayout.css';

interface Props {
  role: string;                    // which role's menu to show (e.g. "coordinator")
  children: ReactNode;             // page content rendered in the main area
}

/* App layout wrapper — top bar + sidebar + scrollable main content area */
const AppLayout = ({ role, children }: Props) => {
  const items = menuConfig[role] || [];                    // get menu items for this role

  return (
    <div className="app-layout">
      <TopBar role={role} />       {/* fixed top bar */}
      <div className="app-body">
        <SideBar items={items} />  {/* fixed sidebar on the left */}
        <main className="app-content">
          {children}               {/* page-specific content */}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
