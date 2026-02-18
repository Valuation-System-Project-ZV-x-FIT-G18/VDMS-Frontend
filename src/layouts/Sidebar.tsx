import type { CSSProperties } from 'react';
import {
  DashboardOutlined,
  FolderOpenOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
  
} from '@ant-design/icons';
import { theme } from '../styles/theme';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userType: 'credit_officer' | 'property_owner';
}

const Sidebar = ({ activePage, onNavigate, userType }: SidebarProps) => {

  const sidebarStyle: CSSProperties = {
    width: '180px',
    height: '100%',
    backgroundColor: '#f3f7ff',
    padding: '24px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  };

  // ✅ Credit Officer menu items
  const creditOfficerMenuItems = [
    { id: 'dashboard',  label: 'Dashboard',    icon: DashboardOutlined  },
    { id: 'projects',   label: 'All Projects',  icon: FolderOpenOutlined },
   
  ];

  // ✅ Property Owner menu items
  const propertyOwnerMenuItems = [
  { id: 'dashboard', label: 'Dashboard',   icon: DashboardOutlined  },
  { id: 'projects',  label: 'All projects', icon: FolderOpenOutlined },
  { id: 'payment',   label: 'Payment',     icon: CreditCardOutlined },
];

  // ✅ Pick the right menu based on user type
  const menuItems = userType === 'property_owner'
    ? propertyOwnerMenuItems
    : creditOfficerMenuItems;

  // ✅ Bottom items are the same for both user types
  const bottomItems = [
    { id: 'settings', label: 'Setting', icon: SettingOutlined },
    { id: 'logout',   label: 'Logout',  icon: LogoutOutlined  },
  ];

  const getMenuItemStyle = (isActive: boolean): CSSProperties => ({
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 16px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '10px',
    border: isActive
      ? `1px solid ${theme.colors.primary.main}`
      : '1px solid #e1e6f0',
    backgroundColor: isActive ? '#e6f0ff' : '#ffffff',
    color: isActive
      ? theme.colors.primary.main
      : '#1f2937',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={sidebarStyle}>
      {/* Main Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;

          return (
            <div
              key={item.id}
              style={getMenuItemStyle(isActive)}
              onClick={() => onNavigate(item.id)}
            >
              <IconComponent
                style={{
                  fontSize: '18px',
                  color: isActive ? theme.colors.primary.main : '#1f2937',
                }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom Menu */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {bottomItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;

          return (
            <div
              key={item.id}
              style={getMenuItemStyle(isActive)}
              onClick={() => onNavigate(item.id)}
            >
              <IconComponent
                style={{
                  fontSize: '18px',
                  color: isActive ? theme.colors.primary.main : '#1f2937',
                }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;