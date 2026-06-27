import { useState } from "react";
import type { CSSProperties } from "react";
import {
  MessageOutlined,
  ThunderboltFilled,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  SettingOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useTranslation } from "../context/SettingsContext";
import NotificationsDropdown from "../components/organisms/NotificationsDropdown";
import MessagingSystem from "../components/organisms/MessagingSystem";
import { theme } from "../styles/theme";

interface HeaderProps {
  userName: string;
  userRole: string;
  userPhoto?: string;
  onMenuToggle?: () => void;
  isMobile?: boolean;
  menuOpen?: boolean;
  onLogout?: () => void;
  userEmail?: string;
  userPhone?: string;
  onNavigate?: (page: string) => void;
}

const Header = ({
  userName,
  userRole,
  userPhoto,
  onMenuToggle,
  isMobile,
  menuOpen,
  onLogout,
  userEmail,
  userPhone = "+94 77 123 4567",
  onNavigate,
}: HeaderProps) => {
  const [showMessaging, setShowMessaging] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { t } = useTranslation();

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
      {showProfileDropdown && (
        <div 
          onClick={() => setShowProfileDropdown(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            backgroundColor: "transparent"
          }}
        />
      )}
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

          <div 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "8px",
              transition: "background-color 0.2s",
              gap: "8px",
              position: "relative",
              userSelect: "none"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <div style={userInfoStyle}>
              <span style={userNameStyle}>{userName}</span>
              <span style={userRoleStyle}>{userRole}</span>
            </div>

            {userPhoto ? (
              <img src={userPhoto} alt={userName} style={{ ...avatarStyle, objectFit: "cover" }} />
            ) : (
              <div style={avatarStyle}>{userName.charAt(0).toUpperCase()}</div>
            )}

            {showProfileDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: 0,
                  width: "290px",
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  border: "1px solid #e5e7eb",
                  padding: "18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "14px",
                  zIndex: 100,
                  cursor: "default"
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* User Header */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  {userPhoto ? (
                    <img 
                      src={userPhoto} 
                      alt={userName} 
                      style={{ 
                        width: "64px", 
                        height: "64px", 
                        borderRadius: "50%", 
                        objectFit: "cover",
                        border: `2px solid ${theme.colors.primary.main}`
                      }} 
                    />
                  ) : (
                    <div 
                      style={{ 
                        width: "64px", 
                        height: "64px", 
                        borderRadius: "50%", 
                        backgroundColor: getAvatarColor(),
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "26px"
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827", textAlign: "center" }}>{userName}</div>
                  <span 
                    style={{ 
                      fontSize: "11px", 
                      fontWeight: 600, 
                      color: theme.colors.primary.main, 
                      backgroundColor: `${theme.colors.primary.main}12`, 
                      padding: "3px 10px", 
                      borderRadius: "20px",
                      border: `1px solid ${theme.colors.primary.main}40`
                    }}
                  >
                    {userRole}
                  </span>
                </div>

                <div style={{ width: "100%", height: "1px", backgroundColor: "#f3f4f6" }} />

                {/* Details Section */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {userEmail && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
                      <MailOutlined style={{ color: "#9ca3af" }} />
                      <span style={{ wordBreak: "break-all" }}>{userEmail}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
                    <PhoneOutlined style={{ color: "#9ca3af" }} />
                    <span>{userPhone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
                    <CheckCircleFilled style={{ color: "#52c41a" }} />
                    <span>{t("statusActive")}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#4b5563" }}>
                    <span style={{ fontSize: "14px", color: "#9ca3af", lineHeight: 1 }}>📅</span>
                    <span>{t("memberSince")}</span>
                  </div>
                </div>

                <div style={{ width: "100%", height: "1px", backgroundColor: "#f3f4f6" }} />

                {/* Action Buttons */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {onNavigate && (
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onNavigate("settings");
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "1.5px solid #d9d9d9",
                        backgroundColor: "#ffffff",
                        color: "#374151",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f9fafb"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ffffff"}
                    >
                      <SettingOutlined />
                      {t("goSettings")}
                    </button>
                  )}

                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onLogout();
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#fff2f0",
                        color: "#ff4d4f",
                        fontWeight: 600,
                        fontSize: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "background-color 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ffccc7"}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "#fff2f0"}
                    >
                      <LogoutOutlined />
                      {t("logout")}
                    </button>
                  )}
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
