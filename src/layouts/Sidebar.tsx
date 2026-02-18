import type { CSSProperties } from 'react';
import {
  DashboardOutlined,
  FolderOpenOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
   ClockCircleOutlined,   
  CheckCircleOutlined,    
  CloseCircleOutlined,   
  FileTextOutlined,       
  LockOutlined,          
  HistoryOutlined  
} from '@ant-design/icons';
import { theme } from '../styles/theme';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  role?: string;           // ← add this line

}

const Sidebar = ({ activePage, onNavigate, role }: SidebarProps) => {

  const sidebarStyle: CSSProperties = {
    width: '180px',                  // little wider (looks more professional)
    height: '100%',
    backgroundColor: '#f3f7ff',
    padding: '24px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',                     // better spacing between buttons
  };

  const defaultMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardOutlined },
    { id: 'projects', label: 'All projects', icon: FolderOpenOutlined },
    { id: 'payment', label: 'Payment', icon: CreditCardOutlined },
  ];

  const l3MenuItems = [
  { id: 'dashboard', label: 'Dashboard',        icon: DashboardOutlined   },
  { id: 'pending',   label: 'Pending Reviews',  icon: ClockCircleOutlined },
  { id: 'approved',  label: 'Approved Reports', icon: CheckCircleOutlined },
  { id: 'rejected',  label: 'Rejected Reports', icon: CloseCircleOutlined },
  { id: 'all',       label: 'All Reports',       icon: FileTextOutlined    },
  { id: 'finalized', label: 'Finalized Reports', icon: LockOutlined        },
  { id: 'history',   label: 'Version History',   icon: HistoryOutlined     },
];

const menuItems = role === 'l3-manager' ? l3MenuItems : defaultMenuItems;

  const bottomItems = [
    { id: 'settings', label: 'Setting', icon: SettingOutlined },
    { id: 'logout', label: 'Logout', icon: LogoutOutlined },
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

    // ✅ Stroke (border)
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
                  color: isActive
                    ? theme.colors.primary.main
                    : '#1f2937',
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
                  color: isActive
                    ? theme.colors.primary.main
                    : '#1f2937',
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
