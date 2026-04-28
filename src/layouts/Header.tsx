import type { CSSProperties } from "react";
import {
  ThunderboltFilled,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import NotificationsDropdown from "../components/organisms/NotificationsDropdown";
import { theme } from "../styles/theme";

interface HeaderProps {
  userName: string;
  userRole: string;
  role?: string;
  onMenuToggle?: () => void;
  isMobile?: boolean;
  menuOpen?: boolean;
}

const Header = ({
  userName,
  userRole,
  role,
  onMenuToggle,
  isMobile,
  menuOpen,
}: HeaderProps) => {
  const headerStyle: CSSProperties = {
    height: "64px",
    backgroundColor: "#e6f7ff",
    borderBottom: "1px solid #c9dcff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "0 12px" : "0 16px",
    gap: "8px",
  };

  const brandStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "8px" : "10px",
    minWidth: 0,
    flex: isMobile ? 1 : undefined,
  };

  const menuToggleStyle: CSSProperties = {
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: theme.colors.primary.main,
  };

  const brandIconStyle: CSSProperties = {
    width: isMobile ? "28px" : "34px",
    height: isMobile ? "28px" : "34px",
    borderRadius: "10px",
    backgroundColor: theme.colors.primary.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: isMobile ? "14px" : "16px",
    flexShrink: 0,
  };

  const brandTextStyle: CSSProperties = {
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: 700,
    color: theme.colors.primary.main,
    whiteSpace: "nowrap",
  };

  const rightStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "8px" : "16px",
    minWidth: 0,
  };

  const iconButtonStyle: CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "white",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    flexShrink: 0,
  };

  const userInfoStyle: CSSProperties = {
    display: isMobile ? "none" : "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginRight: "8px",
  };

  const userNameStyle: CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: theme.colors.text.primary,
  };

  const userRoleStyle: CSSProperties = {
    fontSize: "12px",
    color: theme.colors.text.secondary,
  };

  const getAvatarColor = () => {
    const colors = [
      "#1890ff",
      "#52c41a",
      "#722ed1",
      "#fa8c16",
      "#eb2f96",
      "#13c2c2",
      "#f5222d",
      "#faad14",
    ];
    const index = userName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const avatarStyle: CSSProperties = {
    width: isMobile ? "32px" : "40px",
    height: isMobile ? "32px" : "40px",
    borderRadius: "50%",
    backgroundColor: getAvatarColor(),
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: isMobile ? "14px" : "16px",
    flexShrink: 0,
  };

  return (
    <>
      <header style={headerStyle}>
        {isMobile && (
          <button style={menuToggleStyle} onClick={onMenuToggle}>
            {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        )}

        <div style={brandStyle}>
          <div style={brandIconStyle}>
            <ThunderboltFilled />
          </div>
          <span style={brandTextStyle}>ABC VDMS</span>
        </div>

        <div style={rightStyle}>
          <NotificationsDropdown role={role} />

          <div style={userInfoStyle}>
            <span style={userNameStyle}>{userName}</span>
            <span style={userRoleStyle}>{userRole}</span>
          </div>

          <div style={avatarStyle}>{userName.charAt(0).toUpperCase()}</div>
        </div>
      </header>
    </>
  );
};

export default Header;
