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
  const inactiveButtonBorderColor = "#c9dcff";

  const sidebarStyle: CSSProperties = {
    width: "180px",
    height: "100%",
    backgroundColor: sidebarBackgroundColor,
    padding: "24px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  };

  // Bank Credit Officer menu items

 


  const bankMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: DashboardOutlined },
    { id: "projects", label: "All projects", icon: FolderOpenOutlined },
                 //below line should remove
    { id: "secure-share-test", label: "Secure Share Test", icon: FolderOpenOutlined },
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
    height: "44px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "10px",
    border: isActive
      ? `1px solid ${theme.colors.primary.main}`
      : `1px solid ${inactiveButtonBorderColor}`,
    backgroundColor: isActive ? "#e6f0ff" : sidebarBackgroundColor,
    color: isActive ? theme.colors.primary.main : "#1f2937",
    transition: "all 0.2s ease",
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
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
            <div
              key={item.id}
              style={getMenuItemStyle(isActive)}
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
                  fontSize: '18px',
                  color: isActive ? theme.colors.primary.main : '#1f2937',
                }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom Menu (Settings & Logout) */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {bottomItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;

          return (
            <div
              key={item.id}
              style={getMenuItemStyle(isActive)}
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
                  fontSize: "18px",
                  color: isActive ? theme.colors.primary.main : "#1f2937",
                }}
              />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;