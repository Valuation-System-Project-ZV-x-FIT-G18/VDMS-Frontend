import { useState } from "react";
import type { CSSProperties } from "react";
import {
  MessageOutlined,
  ThunderboltFilled,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
// import NotificationsDropdown from "../components/organisms/NotificationsDropdown";
import MessagingSystem from "../components/organisms/MessagingSystem";

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

  const headerStyle: CSSProperties = {
    height: "64px",
    backgroundColor: "#d7e6f1",
    borderBottom: "1px solid #b9cfdf",
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
    backgroundColor: "#ffffff",
    border: "1px solid #c6d8e7",
    cursor: "pointer",
    fontSize: "18px",
    color: "#1f6fbf",
  };

  const brandIconStyle: CSSProperties = {
    width: isMobile ? "28px" : "34px",
    height: isMobile ? "28px" : "34px",
    borderRadius: "10px",
    backgroundColor: "#2b83da",
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
    color: "#1d74c7",
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
    backgroundColor: "#ffffff",
    border: "1px solid #c6d8e7",
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
    color: "#1f3348",
  };

  const userRoleStyle: CSSProperties = {
    fontSize: "12px",
    color: "#48637c",
  };

  const getAvatarColor = () => {
    return "#2b83da";
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
          {/* <NotificationsDropdown /> */}

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

          <div style={avatarStyle}>{userName.charAt(0).toUpperCase()}</div>
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
