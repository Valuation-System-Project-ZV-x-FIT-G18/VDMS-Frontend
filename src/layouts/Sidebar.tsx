import type { CSSProperties } from "react";
import { Link } from 'react-router-dom';
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
    //below line should remove
    {
      id: "secure-share-test",
      label: "Secure Share Test",
      icon: FolderOpenOutlined,
    },
  ];

  // Property Owner menu items
  const ownerMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "projects", label: "All projects", icon: FolderOpenOutlined },
    { id: "payment", label: "Payment", icon: CreditCardOutlined },
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

  const l2MenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "pending", label: "Pending Reviews", icon: ClockCircleOutlined },
    { id: "approved", label: "Approved Reports", icon: CheckCircleOutlined },
    { id: "rejected", label: "Rejected Reports", icon: CloseCircleOutlined },
    { id: "all", label: "All Reports", icon: FileTextOutlined },
    { id: "finalized", label: "Finalized Reports", icon: LockOutlined },
    { id: "history", label: "Version History", icon: HistoryOutlined },
  ];

  const l1MenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "pending", label: "Pending Reviews", icon: ClockCircleOutlined },
    { id: "approved", label: "Approved Reports", icon: CheckCircleOutlined },
    { id: "rejected", label: "Rejected Reports", icon: CloseCircleOutlined },
    { id: "all", label: "All Reports", icon: FileTextOutlined },
    { id: "finalized", label: "Finalized Reports", icon: LockOutlined },
    { id: "history", label: "Version History", icon: HistoryOutlined },
  ];

  const getMenuItems = () => {
  // COORDINATOR menu items (SIMPLIFIED - only what you need)
  const coordinatorMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "create-project", label: "Create Project", icon: PlusOutlined },
    { id: "fleet-management", label: "Fleet Management", icon: UserOutlined },
    { id: "project-status", label: "Project Status", icon: BarChartOutlined },
    { id: "messages", label: "Messages", icon: FileTextOutlined },
    // Add these only if you have the pages
    // { id: "projects", label: "All Projects", icon: FolderOpenOutlined },
    // { id: "clients", label: "Clients", icon: UserOutlined },
    // { id: "reports", label: "Reports", icon: BarChartOutlined },
  ];

  // Admin menu items
  const adminMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "users", label: "Users", icon: UserOutlined },
    { id: "settings", label: "Settings", icon: SettingOutlined },
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

  // Get menu items based on role
  const getMenuItems = () => {
    switch (role) {
      case "l3-manager":
        return l3MenuItems;
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
      default: // Bank credit officer
        return bankMenuItems;
    }
     
    if (role === "l3-manager") return l3MenuItems;
    if (role === "l2-manager") return l2MenuItems;
    if (role === "l1-manager") return l1MenuItems;
    if (role === "owner") return ownerMenuItems;
    return bankMenuItems; // default for bank and others
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
      // Handle logout
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    } else if (itemId === "workflow") {
      // For legacy workflow id, go to first step
      window.location.href = '/coordinator/workflow/search';
    } else if (itemId === 'create-project') {
      // Create Project should start the workflow at Client Search
      window.location.href = '/coordinator/workflow/search';
    } else if (itemId === 'fleet-management') {
      window.location.href = '/coordinator/fleet-management';
    } else if (itemId === 'project-status') {
      window.location.href = '/coordinator/projects';
    } else if (itemId === 'messages') {
      window.location.href = '/coordinator/messages';
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

          // For coordinator-specific route links, render Link so Router handles it client-side
          if (role === 'coordinator' && item.id === 'create-project') {
            return (
              <Link key={item.id} to="/coordinator/workflow/search" style={{ textDecoration: 'none' }}>
                <div
                  style={getMenuItemStyle(isActive)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f0f5ff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <IconComponent
                    style={{
                      fontSize: '18px',
                      color: isActive ? theme.colors.primary.main : '#1f2937',
                    }}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          }

          // If pages don't exist yet, render placeholder anchors that point to '#'
          if (role === 'coordinator' && (item.id === 'fleet-management' || item.id === 'project-status' || item.id === 'messages')) {
            return (
              <a
                key={item.id}
                href="#"
                style={{ textDecoration: 'none' }}
                onClick={(e) => e.preventDefault()}
              >
                <div
                  style={getMenuItemStyle(isActive)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f0f5ff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <IconComponent
                    style={{
                      fontSize: '18px',
                      color: isActive ? theme.colors.primary.main : '#1f2937',
                    }}
                  />
                  <span>{item.label}</span>
                </div>
              </a>
            );
          }

          return (
            <button
              key={item.id}
              style={getMenuItemStyle(isActive)}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={(e) => {
                const hoverStyle = getMenuItemHoverStyle(isActive);
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseLeave={(e) => {
                const baseStyle = getMenuItemStyle(isActive);
                e.currentTarget.style.backgroundColor =
                  baseStyle.backgroundColor as string;
                e.currentTarget.style.color = baseStyle.color as string;
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f0f5ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <IconComponent
                style={{
                  fontSize: "20px",
                  color: isActive ? "#3b82f6" : "#9ca3af",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  flexShrink: 0,
                  fontSize: '18px',
                  color: isActive ? theme.colors.primary.main : '#1f2937',
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
              onClick={() => onNavigate(item.id)}
              onMouseEnter={(e) => {
                const hoverStyle = getMenuItemHoverStyle(isActive);
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseLeave={(e) => {
                const baseStyle = getMenuItemStyle(isActive);
                e.currentTarget.style.backgroundColor =
                  baseStyle.backgroundColor as string;
                e.currentTarget.style.color = baseStyle.color as string;
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#f0f5ff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }
              }}
            >
              <IconComponent
                style={{
                  fontSize: "20px",
                  color: isActive ? "#3b82f6" : "#9ca3af",
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