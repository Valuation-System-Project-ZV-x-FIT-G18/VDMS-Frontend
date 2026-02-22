import type { CSSProperties } from "react";

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

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  role?: string;
}

const Sidebar = ({ activePage, onNavigate, role }: SidebarProps) => {
  const sidebarBackgroundColor = theme.colors.background.sidebar;

  const sidebarStyle: CSSProperties = {
    width: "200px",
    height: "100%",
    backgroundColor: sidebarBackgroundColor,
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    borderRight: "1px solid #e5e7eb",
  };

  // Bank Credit Officer menu items
  const bankMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "projects", label: "All projects", icon: FolderOpenOutlined },
  ];

  // Property Owner menu items
  const ownerMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "projects", label: "All projects", icon: FolderOpenOutlined },
    { id: "payment", label: "Payment", icon: CreditCardOutlined },
  ];

  // COORDINATOR menu items
  const coordinatorMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "create-project", label: "Create Project", icon: PlusOutlined },
    { id: "fleet-management", label: "Fleet Management", icon: UserOutlined },
    { id: "project-status", label: "Project Status", icon: BarChartOutlined },
    { id: "messages", label: "Messages", icon: FileTextOutlined },
  ];

  // Admin menu items
  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "users", label: "Users", icon: UserOutlined },
  ];

  // Technical Officer menu items
  const technicalOfficerMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "assignments", label: "My Assignments", icon: FolderOpenOutlined },
    { id: "schedule", label: "Schedule", icon: ClockCircleOutlined },
  ];

  // Senior Valuator menu items
  const seniorValuatorMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "reports", label: "Reports", icon: FileTextOutlined },
    { id: "approvals", label: "Approvals", icon: CheckCircleOutlined },
  ];

  // L3 Manager menu items
  const l3MenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "pending", label: "Pending Reviews", icon: ClockCircleOutlined },
    { id: "approved", label: "Approved Reports", icon: CheckCircleOutlined },
    { id: "rejected", label: "Rejected Reports", icon: CloseCircleOutlined },
    { id: "all", label: "All Reports", icon: FileTextOutlined },
    { id: "finalized", label: "Finalized Reports", icon: LockOutlined },
    { id: "history", label: "Version History", icon: HistoryOutlined },
  ];

  // L2 Manager menu items
  const l2MenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "pending", label: "Pending Reviews", icon: ClockCircleOutlined },
    { id: "approved", label: "Approved Reports", icon: CheckCircleOutlined },
    { id: "rejected", label: "Rejected Reports", icon: CloseCircleOutlined },
    { id: "all", label: "All Reports", icon: FileTextOutlined },
    { id: "finalized", label: "Finalized Reports", icon: LockOutlined },
    { id: "history", label: "Version History", icon: HistoryOutlined },
  ];

  // L1 Manager menu items
  const l1MenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "pending", label: "Pending Reviews", icon: ClockCircleOutlined },
    { id: "approved", label: "Approved Reports", icon: CheckCircleOutlined },
    { id: "rejected", label: "Rejected Reports", icon: CloseCircleOutlined },
    { id: "all", label: "All Reports", icon: FileTextOutlined },
    { id: "finalized", label: "Finalized Reports", icon: LockOutlined },
    { id: "history", label: "Version History", icon: HistoryOutlined },
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
    { id: "settings", label: "Settings", icon: SettingOutlined },
    { id: "logout", label: "Logout", icon: LogoutOutlined },
  ];

  const getMenuItemStyle = (isActive: boolean): CSSProperties => ({
    height: "48px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 14px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: isActive ? 600 : 500,
    borderRadius: "8px",
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
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    } else if (itemId === "create-project") {
      onNavigate("create-project");
    } else if (itemId === "fleet-management") {
      onNavigate("fleet-management");
    } else if (itemId === "project-status") {
      onNavigate("project-status");
    } else if (itemId === "messages") {
      onNavigate("messages");
    } else {
      onNavigate(itemId);
    }
  };

  return (
    <div style={sidebarStyle}>
      {/* Main Menu */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
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
                  fontSize: "18px",
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
                    height: "20px",
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
          gap: "4px",
          paddingTop: "12px",
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
                  fontSize: "18px",
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
                    height: "20px",
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
