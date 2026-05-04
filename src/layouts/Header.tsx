import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import {
  MessageOutlined,
  ThunderboltFilled,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import NotificationsDropdown from "../components/organisms/NotificationsDropdown";
import MessagingSystem from "../components/organisms/MessagingSystem";
import { theme } from "../styles/theme";

interface HeaderProps {
  userName: string;
  userRole: string;
  onMenuToggle?: () => void;
  isMobile?: boolean;
  menuOpen?: boolean;
}

const Header = ({
  userName,
  userRole,
  onMenuToggle,
  isMobile,
  menuOpen,
}: HeaderProps) => {
  const [showMessaging, setShowMessaging] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

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
    cursor: "pointer",
    position: "relative",
  };

  const userMenuStyle: CSSProperties = {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    minWidth: "160px",
    zIndex: 1000,
  };

  const menuItemStyle: CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#374151",
    fontSize: "13px",
    transition: "background-color 0.2s",
  };

  const handleLogout = () => {
    localStorage.clear();
    setShowUserMenu(false);
    navigate("/");
    window.location.reload();
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
          <NotificationsDropdown />

          {/* Message Icon - Opens Messaging System */}
          <button
            style={iconButtonStyle}
            onClick={() => setShowMessaging(true)}
          >
            <MessageOutlined
              style={{ fontSize: isMobile ? "16px" : "18px", color: "#595959" }}
            />
          </button>

          <div style={userInfoStyle}>
            <span style={userNameStyle}>{userName}</span>
            <span style={userRoleStyle}>{userRole}</span>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={avatarStyle}
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="Click to open user menu"
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div style={userMenuStyle}>
                <div
                  style={menuItemStyle}
                  onClick={handleLogout}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  <LogoutOutlined style={{ fontSize: "14px" }} />
                  Logout
                </div>
              </div>
            )}
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
