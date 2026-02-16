import type { CSSProperties } from 'react';
import { BellOutlined, MessageOutlined, ThunderboltFilled } from '@ant-design/icons';
import { theme } from '../styles/theme';

interface HeaderProps {
  userName: string;
  userRole: string;
}

const Header = ({ userName, userRole }: HeaderProps) => {
  const headerStyle: CSSProperties = {
    height: '64px',
    backgroundColor: '#e6f7ff',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // ✅ left logo + right controls
    padding: '0 16px',
  };

  // ✅ Brand (left)
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

  // ✅ Right controls group
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

  const notificationDotStyle: CSSProperties = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    backgroundColor: '#ff4d4f',
    borderRadius: '50%',
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

  const avatarStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '16px',
  };

  return (
    <header style={headerStyle}>
      {/* ✅ Company logo/name on the FAR LEFT */}
      <div style={brandStyle}>
        <div style={brandIconStyle}>
          <ThunderboltFilled />
        </div>
        <span style={brandTextStyle}>ABC VDMS</span>
      </div>

      {/* Right side */}
      <div style={rightStyle}>
        <button style={iconButtonStyle}>
          <span style={notificationDotStyle}></span>
          <BellOutlined style={{ fontSize: '18px', color: '#595959' }} />
        </button>

        <button style={iconButtonStyle}>
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
  );
};

export default Header;
