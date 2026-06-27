import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

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
  HistoryOutlined,
  UserOutlined,
  BarChartOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { theme } from "../styles/theme";
import { useTranslation } from "../context/SettingsContext";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  role?: string;
}

const Sidebar = ({ activePage, onNavigate, role }: SidebarProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarBackgroundColor = theme.colors.background.sidebar;

  const sidebarStyle: CSSProperties = {
    width: "200px",
    height: "100%",
    backgroundColor: sidebarBackgroundColor,
    padding: isMobile ? "12px 10px" : "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? "4px" : "8px",
    borderRight: "1px solid #e5e7eb",
    overflow: "auto",
  };

  // Bank Credit Officer menu items
  const bankMenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "projects", label: t("allProjects"), icon: FolderOpenOutlined },
  ];

  // Property Owner menu items
  const ownerMenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "projects", label: t("allProjects"), icon: FolderOpenOutlined },
    { id: "payment", label: t("payment"), icon: CreditCardOutlined },
  ];

  // COORDINATOR menu items
  const coordinatorMenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "create-project", label: t("createProject"), icon: PlusOutlined },
    { id: "fleet-management", label: t("fleetManagement"), icon: UserOutlined },
    { id: "project-status", label: t("allProjects"), icon: BarChartOutlined },
    { id: "messages", label: "Messages", icon: FileTextOutlined },
  ];

  // Admin menu items
  const adminMenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "users", label: t("users"), icon: UserOutlined },
    { id: "valuation-types", label: t("valuationTypes"), icon: FileTextOutlined},
    { id: "templates", label: t("templates"), icon:  BarChartOutlined},
  ];

  // Technical Officer menu items
  const technicalOfficerMenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "projects", label: t("assignedProjects"), icon: FolderOpenOutlined },
    { id: "reports", label: t("reports"), icon: FileTextOutlined },
    { id: "documents", label: t("documents"), icon: FileTextOutlined },
    { id: "attendance", label: t("attendance"), icon: ClockCircleOutlined },
  ];

  // Senior Valuator menu items
  const seniorValuatorMenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "reports", label: t("reports"), icon: FileTextOutlined },
    { id: "approvals", label: t("approvals"), icon: CheckCircleOutlined },
  ];

  // L3 Manager menu items
  const l3MenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "pending", label: t("pendingReviews"), icon: ClockCircleOutlined },
    { id: "approved", label: t("approvedReports"), icon: CheckCircleOutlined },
    { id: "rejected", label: t("rejectedReports"), icon: CloseCircleOutlined },
    { id: "all", label: t("allReports"), icon: FileTextOutlined },
    { id: "finalized", label: t("finalizedReports"), icon: LockOutlined },
    { id: "history", label: t("versionHistory"), icon: HistoryOutlined },
  ];

  // L2 Manager menu items
  const l2MenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "projects", label: t("allProjects"), icon: FolderOpenOutlined },
    { id: "approvals", label: t("approvals"), icon: CheckCircleOutlined },
    { id: "reports", label: t("reports"), icon: FileTextOutlined },
    { id: "pending", label: t("pendingReviews"), icon: ClockCircleOutlined },
    { id: "approved", label: t("approvedReports"), icon: CheckCircleOutlined },
    { id: "rejected", label: t("rejectedReports"), icon: CloseCircleOutlined },
    { id: "all", label: t("allReports"), icon: FileTextOutlined },
    { id: "finalized", label: t("finalizedReports"), icon: LockOutlined },
    { id: "history", label: t("versionHistory"), icon: HistoryOutlined },
  ];

  // L1 Manager menu items
  const l1MenuItems = [
    { id: "dashboard", label: t("dashboard"), icon: DashboardOutlined },
    { id: "projects", label: t("allProjects"), icon: FolderOpenOutlined },
    { id: "approvals", label: t("approvals"), icon: CheckCircleOutlined },
    { id: "reports", label: t("reports"), icon: FileTextOutlined },
    { id: "pending", label: t("pendingReviews"), icon: ClockCircleOutlined },
    { id: "approved", label: t("approvedReports"), icon: CheckCircleOutlined },
    { id: "rejected", label: t("rejectedReports"), icon: CloseCircleOutlined },
    { id: "all", label: t("allReports"), icon: FileTextOutlined },
    { id: "finalized", label: t("finalizedReports"), icon: LockOutlined },
    { id: "history", label: t("versionHistory"), icon: HistoryOutlined },
    { id: "bottlenecks", label: t("bottlenecks"), icon: BarChartOutlined },
    { id: "morning-report", label: t("morningReport"), icon: ClockCircleOutlined },
  ];

  // Get menu items based on role
  const getMenuItems = () => {
    switch (role) {
      case "l3-manager":
        return l3MenuItems;
      case "l2-manager":
        return l2MenuItems;
      case "l1-manager":
        return l1MenuItems;
      case "owner":
        return ownerMenuItems;
      case "coordinator":
        return coordinatorMenuItems;
      case "admin":
        return adminMenuItems;
      case "technical-officer":
        return technicalOfficerMenuItems;
      case "senior-valuator":
        return seniorValuatorMenuItems;
      default:
        return bankMenuItems;
    }
  };

  const menuItems = getMenuItems();

  // Bottom items (common for all roles)
  const bottomItems = [
    { id: "settings", label: t("settings"), icon: SettingOutlined },
    { id: "logout", label: t("logout"), icon: LogoutOutlined },
  ];

  const getMenuItemStyle = (isActive: boolean): CSSProperties => ({
    height: isMobile ? "44px" : "48px",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "10px" : "12px",
    padding: isMobile ? "0 10px" : "0 14px",
    cursor: "pointer",
    fontSize: isMobile ? "12px" : "13px",
    fontWeight: isActive ? 600 : 500,
    borderRadius: "6px",
    border: "none",
    backgroundColor: isActive ? "#e6f0ff" : "transparent",
    color: isActive ? "#3b82f6" : "#6b7280",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    width: "100%",
  });

const getMenuItemHoverStyle = (isActive: boolean): CSSProperties => ({
  backgroundColor: isActive ? "#d9e9ff" : "#f3f4f6",
  color: isActive ? "#2563eb" : "#4b5563",
});

// Handle navigation with special cases
  const handleItemClick = (itemId: string) => {
    if (itemId === "logout") {
      onNavigate("logout");
    } else if (itemId === "create-project") {
      onNavigate("create-project");
    } else if (itemId === "fleet-management") {
      onNavigate("fleet-management");
    } else if (itemId === "project-status" || itemId === "messages") {
      // Both pages are currently not implemented; fallback to dashboard
      onNavigate("dashboard");
    } else {
      onNavigate(itemId);
    }
  };

  return (
    <div style={sidebarStyle}>
      {/* Main Menu */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "4px" : "4px",
        }}
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              style={getMenuItemStyle(isActive)}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                const hoverStyle = getMenuItemHoverStyle(isActive);
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseLeave={(e) => {
                const baseStyle = getMenuItemStyle(isActive);
                e.currentTarget.style.backgroundColor =
                  baseStyle.backgroundColor as string;
                e.currentTarget.style.color = baseStyle.color as string;
              }}
            >
              <IconComponent
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: isActive ? theme.colors.primary.main : "#1f2937",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    width: "3px",
                    height: "18px",
                    borderRadius: "2px",
                    backgroundColor: "#3b82f6",
                    marginLeft: "auto",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Menu (Settings & Logout) */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "4px" : "4px",
          paddingTop: isMobile ? "8px" : "12px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        {bottomItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              style={getMenuItemStyle(isActive)}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                const hoverStyle = getMenuItemHoverStyle(isActive);
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseLeave={(e) => {
                const baseStyle = getMenuItemStyle(isActive);
                e.currentTarget.style.backgroundColor =
                  baseStyle.backgroundColor as string;
                e.currentTarget.style.color = baseStyle.color as string;
              }}
            >
              <IconComponent
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: isActive ? theme.colors.primary.main : "#1f2937",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "left",
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    width: "3px",
                    height: "18px",
                    borderRadius: "2px",
                    backgroundColor: "#3b82f6",
                    marginLeft: "auto",
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;