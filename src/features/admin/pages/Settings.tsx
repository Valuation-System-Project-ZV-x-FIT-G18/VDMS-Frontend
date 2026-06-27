import { useState } from "react";
import type { CSSProperties } from "react";
import {
  UserOutlined,
  BellOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useSettings, useTranslation } from "../../../context/SettingsContext";

interface SettingsProps {
  role?: string;
}

const SettingsPage = ({ role = "admin" }: SettingsProps) => {
  const { themeColor, language, themeMode, setThemeColor, setLanguage, setThemeMode } = useSettings();
  const { t } = useTranslation();

  const isAdmin = role === "admin";
  const isDark = themeMode === "dark";

  // Dynamic colors based on mode
  const bg = {
    page: isDark ? "#0f172a" : "#f0f4ff",
    card: isDark ? "#1e293b" : "#ffffff",
    cardBorder: isDark ? "#334155" : "#E8EDF5",
    input: isDark ? "#0f172a" : "#ffffff",
    inputDisabled: isDark ? "#1a2744" : "#F9FAFB",
    inputBorder: isDark ? "#334155" : "#D1D5DB",
    inputBorderDisabled: isDark ? "#2d3f5e" : "#E5E7EB",
    divider: isDark ? "#334155" : "#F3F4F6",
    navBg: isDark ? "#1e293b" : "#ffffff",
    navBorder: isDark ? "#334155" : "#E8EDF5",
  };
  const tx = {
    primary: isDark ? "#f3f4f6" : "#111827",
    secondary: isDark ? "#9ca3af" : "#6B7280",
    label: isDark ? "#d1d5db" : "#374151",
    nav: isDark ? "#94a3b8" : "#4B5563",
    input: isDark ? "#e2e8f0" : "#111827",
    inputDisabled: isDark ? "#64748b" : "#6B7280",
  };

  // Tabs: 'profile' | 'system' | 'notifications'
  const [activeTab, setActiveTab] = useState<"profile" | "system" | "notifications">("profile");

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "admin@zavolt.com",
    phone: "+94 77 123 4567",
    twoFactorAuth: false,
    sessionTimeout: "30",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // System Configuration state (Admin Only)
  const [systemData, setSystemData] = useState({
    systemName: "ZaVolt VDMS",
    supportEmail: "support@zavolt.com",
    defaultPageSize: "10",
    maintenanceMode: false,
    allowRegistration: true,
  });
  const [isEditingSystem, setIsEditingSystem] = useState(false);
  const [isSavingSystem, setIsSavingSystem] = useState(false);

  // Notification Config state
  const [notificationData, setNotificationData] = useState({
    userRegistration: true,
    systemBackups: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemChange = (field: string, value: string | boolean) => {
    setSystemData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    }, 800);
  };

  const handleSaveSystem = () => {
    setIsSavingSystem(true);
    setTimeout(() => {
      setIsSavingSystem(false);
      setIsEditingSystem(false);
      alert("System configuration updated successfully!");
    }, 800);
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    alert("Password updated successfully!");
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  // Color options
  const colorOptions = [
    { label: t("blue"), color: "#1890ff" },
    { label: t("green"), color: "#52c41a" },
    { label: t("purple"), color: "#722ed1" },
    { label: t("orange"), color: "#fa8c16" },
    { label: t("red"), color: "#f5222d" },
  ];

  // ─── Styles ──────────────────────────────────────────────────────────────────

  const containerStyle: CSSProperties = {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 10px 40px",
    fontFamily: "'DM Sans', -apple-system, sans-serif",
    minHeight: "100vh",
  };

  const titleStyle: CSSProperties = {
    fontSize: "26px",
    fontWeight: 700,
    color: tx.primary,
    margin: "0 0 6px",
    transition: "color 0.3s",
  };

  const subtitleStyle: CSSProperties = {
    fontSize: "14px",
    color: tx.secondary,
    margin: 0,
    transition: "color 0.3s",
  };

  const layoutStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "32px",
    alignItems: "start",
  };

  const navListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    background: bg.navBg,
    padding: "12px",
    borderRadius: "12px",
    border: `1px solid ${bg.navBorder}`,
    boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.03)",
    transition: "background 0.3s, border 0.3s",
  };

  const navItemStyle = (active: boolean): CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    textAlign: "left",
    width: "100%",
    background: active ? `${themeColor}22` : "transparent",
    color: active ? themeColor : tx.nav,
    transition: "all 0.2s",
  });

  const cardStyle: CSSProperties = {
    backgroundColor: bg.card,
    borderRadius: "16px",
    padding: "28px",
    border: `1px solid ${bg.cardBorder}`,
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.25)" : "0 4px 12px rgba(0,0,0,0.02)",
    marginBottom: "24px",
    transition: "background 0.3s, border 0.3s",
  };

  const sectionTitleStyle: CSSProperties = {
    fontSize: "17px",
    fontWeight: 700,
    color: tx.primary,
    margin: "0 0 20px",
    paddingBottom: "12px",
    borderBottom: `1px solid ${bg.divider}`,
    transition: "color 0.3s, border-color 0.3s",
  };

  const formRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  };

  const formGroupStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  };

  const labelStyle: CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: tx.label,
    transition: "color 0.3s",
  };

  const inputStyle: CSSProperties = {
    padding: "10px 14px",
    border: `1.5px solid ${bg.inputBorder}`,
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: bg.input,
    color: tx.input,
    transition: "all 0.3s",
  };

  const disabledInputStyle: CSSProperties = {
    ...inputStyle,
    backgroundColor: bg.inputDisabled,
    color: tx.inputDisabled,
    cursor: "not-allowed",
    border: `1.5px solid ${bg.inputBorderDisabled}`,
  };

  const buttonStyle = (variant: "primary" | "secondary" | "danger"): CSSProperties => {
    const base: CSSProperties = {
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    };
    if (variant === "primary") return { ...base, backgroundColor: themeColor, color: "white", boxShadow: `0 4px 10px ${themeColor}40` };
    if (variant === "danger") return { ...base, backgroundColor: "#ff4d4f", color: "white", boxShadow: "0 4px 10px rgba(255,77,79,0.25)" };
    return {
      ...base,
      backgroundColor: isDark ? "#1e293b" : "white",
      border: `1.5px solid ${isDark ? "#475569" : "#D1D5DB"}`,
      color: isDark ? "#cbd5e1" : "#374151",
    };
  };

  const toggleContainerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: `1px solid ${bg.divider}`,
    transition: "border-color 0.3s",
  };

  const toggleSwitchStyle = (isOn: boolean): CSSProperties => ({
    width: "44px",
    height: "24px",
    backgroundColor: isOn ? themeColor : (isDark ? "#475569" : "#D1D5DB"),
    borderRadius: "12px",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.25s",
    flexShrink: 0,
  });

  const toggleKnobStyle = (isOn: boolean): CSSProperties => ({
    width: "18px",
    height: "18px",
    backgroundColor: "white",
    borderRadius: "50%",
    position: "absolute",
    top: "3px",
    left: isOn ? "23px" : "3px",
    transition: "all 0.25s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
  });

  const modalOverlayStyle: CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  };

  const modalContentStyle: CSSProperties = {
    backgroundColor: bg.card,
    borderRadius: "16px",
    padding: "28px",
    maxWidth: "420px",
    width: "90%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    border: `1px solid ${bg.cardBorder}`,
  };

  // ─── Mode Toggle Pill ─────────────────────────────────────────────────────
  const modePillStyle = (active: boolean): CSSProperties => ({
    flex: 1,
    padding: "12px 16px",
    borderRadius: "10px",
    border: `2px solid ${active ? themeColor : (isDark ? "#334155" : "#E5E7EB")}`,
    background: active ? `${themeColor}18` : (isDark ? "#0f172a" : "#F9FAFB"),
    color: active ? themeColor : tx.secondary,
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={titleStyle}>{t("settings")}</h1>
        <p style={subtitleStyle}>{t("settingsSub")}</p>
      </div>

      {/* Main Layout */}
      <div style={layoutStyle}>
        {/* Navigation Sidebar */}
        <div style={navListStyle}>
          <button style={navItemStyle(activeTab === "profile")} onClick={() => setActiveTab("profile")}>
            <UserOutlined /> {t("profileSecurity")}
          </button>

          {isAdmin && (
            <>
              <button style={navItemStyle(activeTab === "system")} onClick={() => setActiveTab("system")}>
                <GlobalOutlined /> {t("systemPreferences")}
              </button>
              <button style={navItemStyle(activeTab === "notifications")} onClick={() => setActiveTab("notifications")}>
                <BellOutlined /> {t("notifications")}
              </button>
            </>
          )}
        </div>

        {/* Setting Panels */}
        <div>

          {/* ── TAB 1: Profile & Security ── */}
          {activeTab === "profile" && (
            <>
              {/* Profile Card */}
              <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ ...sectionTitleStyle, borderBottom: "none", margin: 0, paddingBottom: 0 }}>{t("adminProfile")}</h2>
                  {!isEditingProfile ? (
                    <button style={buttonStyle("secondary")} onClick={() => setIsEditingProfile(true)}>
                      {t("editProfile")}
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button style={buttonStyle("secondary")} onClick={() => setIsEditingProfile(false)}>{t("cancel")}</button>
                      <button style={buttonStyle("primary")} onClick={handleSaveProfile} disabled={isSavingProfile}>
                        {isSavingProfile ? "Saving..." : t("save")}
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ width: "100%", height: "1px", backgroundColor: bg.divider, marginBottom: "20px" }} />

                <div style={formRowStyle}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>{t("firstName")}</label>
                    <input type="text" value={profileData.firstName}
                      onChange={e => handleProfileChange("firstName", e.target.value)}
                      disabled={!isEditingProfile}
                      style={isEditingProfile ? inputStyle : disabledInputStyle} />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>{t("lastName")}</label>
                    <input type="text" value={profileData.lastName}
                      onChange={e => handleProfileChange("lastName", e.target.value)}
                      disabled={!isEditingProfile}
                      style={isEditingProfile ? inputStyle : disabledInputStyle} />
                  </div>
                </div>

                <div style={formRowStyle}>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>{t("emailAddress")}</label>
                    <input type="email" value={profileData.email} disabled style={disabledInputStyle} />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>{t("phoneNumber")}</label>
                    <input type="text" value={profileData.phone}
                      onChange={e => handleProfileChange("phone", e.target.value)}
                      disabled={!isEditingProfile}
                      style={isEditingProfile ? inputStyle : disabledInputStyle} />
                  </div>
                </div>
              </div>

              {/* Theme Color + Language + Dark Mode Card */}
              <div style={cardStyle}>
                {/* Theme Color */}
                <h2 style={sectionTitleStyle}>{t("themeColour")}</h2>
                <p style={{ fontSize: "13px", color: tx.secondary, marginBottom: "20px", marginTop: "-12px" }}>{t("themeSub")}</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px" }}>
                  {colorOptions.map(opt => {
                    const isSelected = themeColor === opt.color;
                    return (
                      <div
                        key={opt.color}
                        onClick={() => setThemeColor(opt.color)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px 16px",
                          borderRadius: "12px",
                          border: `2.5px solid ${isSelected ? opt.color : (isDark ? "#334155" : "#E5E7EB")}`,
                          cursor: "pointer",
                          backgroundColor: isSelected ? `${opt.color}18` : (isDark ? "#0f172a" : "#fff"),
                          transition: "all 0.2s",
                        }}
                      >
                        <div style={{
                          width: "20px", height: "20px", borderRadius: "50%",
                          backgroundColor: opt.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: "11px",
                        }}>
                          {isSelected && <CheckOutlined />}
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: isSelected ? opt.color : tx.nav }}>
                          {opt.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Display Mode (Dark / Light) */}
                <h2 style={{ ...sectionTitleStyle, marginTop: "8px" }}>{t("themeMode")}</h2>
                <p style={{ fontSize: "13px", color: tx.secondary, marginBottom: "20px", marginTop: "-12px" }}>{t("themeModeSub")}</p>
                <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
                  <button style={modePillStyle(themeMode === "light")} onClick={() => setThemeMode("light")}>
                    <SunOutlined /> {t("lightMode")}
                  </button>
                  <button style={modePillStyle(themeMode === "dark")} onClick={() => setThemeMode("dark")}>
                    <MoonOutlined /> {t("darkMode")}
                  </button>
                </div>

                {/* Language */}
                <h2 style={{ ...sectionTitleStyle, marginTop: "8px" }}>{t("languageSetting")}</h2>
                <p style={{ fontSize: "13px", color: tx.secondary, marginBottom: "20px", marginTop: "-12px" }}>{t("languageSub")}</p>
                <div style={{ display: "flex", gap: "16px" }}>
                  <button
                    onClick={() => setLanguage("en")}
                    style={{
                      flex: 1,
                      padding: "14px 20px",
                      borderRadius: "12px",
                      border: `2.5px solid ${language === "en" ? themeColor : (isDark ? "#334155" : "#E5E7EB")}`,
                      background: language === "en" ? `${themeColor}18` : (isDark ? "#0f172a" : "#fff"),
                      color: language === "en" ? themeColor : tx.nav,
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    🇺🇸 English (US)
                  </button>
                  <button
                    onClick={() => setLanguage("si")}
                    style={{
                      flex: 1,
                      padding: "14px 20px",
                      borderRadius: "12px",
                      border: `2.5px solid ${language === "si" ? themeColor : (isDark ? "#334155" : "#E5E7EB")}`,
                      background: language === "si" ? `${themeColor}18` : (isDark ? "#0f172a" : "#fff"),
                      color: language === "si" ? themeColor : tx.nav,
                      fontSize: "14px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    🇱🇰 සිංහල (Sinhala)
                  </button>
                </div>
              </div>

              {/* Security Card */}
              <div style={cardStyle}>
                <h2 style={sectionTitleStyle}>{t("securitySettings")}</h2>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: `1px solid ${bg.divider}` }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: tx.primary }}>{t("accountPassword")}</div>
                    <div style={{ fontSize: "13px", color: tx.secondary, marginTop: "2px" }}>{t("passwordSub")}</div>
                  </div>
                  <button style={buttonStyle("secondary")} onClick={() => setShowPasswordModal(true)}>
                    {t("changePassword")}
                  </button>
                </div>

                <div style={toggleContainerStyle}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: tx.primary }}>{t("twoFactor")}</div>
                    <div style={{ fontSize: "13px", color: tx.secondary, marginTop: "2px" }}>{t("twoFactorSub")}</div>
                  </div>
                  <div style={toggleSwitchStyle(profileData.twoFactorAuth)}
                    onClick={() => handleProfileChange("twoFactorAuth", !profileData.twoFactorAuth)}>
                    <div style={toggleKnobStyle(profileData.twoFactorAuth)} />
                  </div>
                </div>

                <div style={{ ...toggleContainerStyle, borderBottom: "none", paddingBottom: 0 }}>
                  <div style={{
                    display: "flex", gap: "10px", alignItems: "flex-start",
                    backgroundColor: `${themeColor}18`, padding: "12px 16px",
                    borderRadius: "10px", width: "100%",
                  }}>
                    <InfoCircleOutlined style={{ color: themeColor, marginTop: "2px" }} />
                    <div style={{ fontSize: "12px", color: themeColor, lineHeight: 1.5 }}>
                      <strong>Active Sessions:</strong> You are currently logged in from IP 192.168.1.18. Last login was June 26, 2026 at 1:15 PM.
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── TAB 2: System Preferences (Admin Only) ── */}
          {activeTab === "system" && isAdmin && (
            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ ...sectionTitleStyle, borderBottom: "none", margin: 0, paddingBottom: 0 }}>{t("systemPreferences")}</h2>
                {!isEditingSystem ? (
                  <button style={buttonStyle("secondary")} onClick={() => setIsEditingSystem(true)}>Edit Settings</button>
                ) : (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button style={buttonStyle("secondary")} onClick={() => setIsEditingSystem(false)}>{t("cancel")}</button>
                    <button style={buttonStyle("primary")} onClick={handleSaveSystem} disabled={isSavingSystem}>
                      {isSavingSystem ? "Saving..." : t("save")}
                    </button>
                  </div>
                )}
              </div>
              <div style={{ width: "100%", height: "1px", backgroundColor: bg.divider, marginBottom: "20px" }} />

              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>{t("systemName")}</label>
                  <input type="text" value={systemData.systemName}
                    onChange={e => handleSystemChange("systemName", e.target.value)}
                    disabled={!isEditingSystem}
                    style={isEditingSystem ? inputStyle : disabledInputStyle} />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>{t("supportEmail")}</label>
                  <input type="email" value={systemData.supportEmail}
                    onChange={e => handleSystemChange("supportEmail", e.target.value)}
                    disabled={!isEditingSystem}
                    style={isEditingSystem ? inputStyle : disabledInputStyle} />
                </div>
              </div>

              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>{t("pageSize")}</label>
                  <select value={systemData.defaultPageSize}
                    onChange={e => handleSystemChange("defaultPageSize", e.target.value)}
                    disabled={!isEditingSystem}
                    style={isEditingSystem ? inputStyle : disabledInputStyle}>
                    <option value="5">5 items per page</option>
                    <option value="10">10 items per page</option>
                    <option value="20">20 items per page</option>
                    <option value="50">50 items per page</option>
                  </select>
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>{t("sessionTimeout")}</label>
                  <select value={profileData.sessionTimeout}
                    onChange={e => handleProfileChange("sessionTimeout", e.target.value)}
                    disabled={!isEditingSystem}
                    style={isEditingSystem ? inputStyle : disabledInputStyle}>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="120">120 minutes</option>
                  </select>
                </div>
              </div>

              <div style={{ width: "100%", height: "1px", backgroundColor: bg.divider, margin: "20px 0" }} />

              <div style={toggleContainerStyle}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: tx.primary }}>{t("maintenanceMode")}</div>
                  <div style={{ fontSize: "13px", color: tx.secondary, marginTop: "2px" }}>{t("maintenanceSub")}</div>
                </div>
                <div style={toggleSwitchStyle(systemData.maintenanceMode)}
                  onClick={() => { if (isEditingSystem) handleSystemChange("maintenanceMode", !systemData.maintenanceMode); }}>
                  <div style={toggleKnobStyle(systemData.maintenanceMode)} />
                </div>
              </div>

              <div style={{ ...toggleContainerStyle, borderBottom: "none", paddingBottom: 0 }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: tx.primary }}>{t("publicReg")}</div>
                  <div style={{ fontSize: "13px", color: tx.secondary, marginTop: "2px" }}>{t("publicRegSub")}</div>
                </div>
                <div style={toggleSwitchStyle(systemData.allowRegistration)}
                  onClick={() => { if (isEditingSystem) handleSystemChange("allowRegistration", !systemData.allowRegistration); }}>
                  <div style={toggleKnobStyle(systemData.allowRegistration)} />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: Notifications (Admin Only) ── */}
          {activeTab === "notifications" && isAdmin && (
            <div style={cardStyle}>
              <h2 style={sectionTitleStyle}>{t("notifications")}</h2>
              <p style={{ fontSize: "13px", color: tx.secondary, marginBottom: "24px", marginTop: "-12px" }}>
                Select which system events you want to be alerted on via your administrative email.
              </p>

              {[
                { key: "userRegistration", label: "New User Registrations", sub: "Get notified immediately when a new user joins the platform." },
                { key: "systemBackups", label: "Automatic Backups", sub: "Receive reports on daily database backups and status success/failures." },
                { key: "securityAlerts", label: "Security Alerts", sub: "Receive instant alerts on brute-force attempts, role changes, and API key status." },
                { key: "marketingEmails", label: "Product Update Emails", sub: "Receive occasional product updates, features announcements, and release details." },
              ].map((item, idx, arr) => (
                <div key={item.key}
                  style={{ ...toggleContainerStyle, ...(idx === arr.length - 1 ? { borderBottom: "none", paddingBottom: 0 } : {}) }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: tx.primary }}>{item.label}</div>
                    <div style={{ fontSize: "13px", color: tx.secondary, marginTop: "2px" }}>{item.sub}</div>
                  </div>
                  <div style={toggleSwitchStyle(notificationData[item.key as keyof typeof notificationData])}
                    onClick={() => handleNotificationChange(item.key, !notificationData[item.key as keyof typeof notificationData])}>
                    <div style={toggleKnobStyle(notificationData[item.key as keyof typeof notificationData])} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Change Password Modal ── */}
      {showPasswordModal && (
        <div style={modalOverlayStyle} onClick={() => setShowPasswordModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: tx.primary, margin: "0 0 4px" }}>{t("changePassword")}</h3>
            <p style={{ fontSize: "13px", color: tx.secondary, margin: "0 0 8px" }}>Enter your current password then choose a new one.</p>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Current Password</label>
              <input type="password" placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>New Password</label>
              <input type="password" placeholder="Min 8 characters"
                value={passwordData.newPassword}
                onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                style={inputStyle} />
            </div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" placeholder="Confirm password"
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                style={inputStyle} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
              <button style={buttonStyle("secondary")} onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}>{t("cancel")}</button>
              <button style={buttonStyle("primary")} onClick={handlePasswordChange}>{t("changePassword")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
