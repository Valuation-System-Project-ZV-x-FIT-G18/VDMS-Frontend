import { useState } from 'react';
import type { CSSProperties } from 'react';
import { MessageOutlined, ThunderboltFilled } from '@ant-design/icons';
import NotificationsDropdown from '../components/organisms/NotificationsDropdown';
import MessagingSystem from '../components/organisms/MessagingSystem';
import { theme } from '../styles/theme';

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header = ({ userName, userRole }: HeaderProps) => {
  const [showMessaging, setShowMessaging] = useState(false);

  const headerStyle: CSSProperties = {
    height: '64px',
    backgroundColor: '#e6f7ff',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
  };

  const brandStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const brandIconStyle: CSSProperties = {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    backgroundColor: theme.colors.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '16px',
  };

  const brandTextStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 700,
    color: theme.colors.primary.main,
  };

  const rightStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const iconButtonStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const userInfoStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: '8px',
  };

  const userNameStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const userRoleStyle: CSSProperties = {
    fontSize: '12px',
    color: theme.colors.text.secondary,
  };

  const getAvatarColor = () => {
    const colors = [
      '#1890ff', '#52c41a', '#722ed1', '#fa8c16',
      '#eb2f96', '#13c2c2', '#f5222d', '#faad14',
    ];
    const index = userName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const avatarStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: getAvatarColor(),
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
    flexShrink: 0,
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={brandStyle}>
          <div style={brandIconStyle}>
            <ThunderboltFilled />
          </div>
          <span style={brandTextStyle}>ABC VDMS</span>
        </div>

        <div style={rightStyle}>
          <NotificationsDropdown />

          {/* Message Icon - Opens Messaging System */}
          <button 
            style={iconButtonStyle}
            onClick={() => setShowMessaging(true)}
          >
            <MessageOutlined style={{ fontSize: '18px', color: '#595959' }} />
          </button>

          <div style={userInfoStyle}>
            <span style={userNameStyle}>{userName}</span>
            <span style={userRoleStyle}>{userRole}</span>
          </div>

          <div style={avatarStyle}>
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Messaging System Modal */}
      {showMessaging && (
        <MessagingSystem onClose={() => setShowMessaging(false)} />
      )}
    </>
  );
};

export default Header;