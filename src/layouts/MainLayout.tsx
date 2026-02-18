import type { CSSProperties, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { theme } from "../styles/theme";

interface MainLayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string, projectId?: string) => void;
  role?: string;
}

const getRoleLabel = (role?: string): string => {
  const roleLabels: Record<string, string> = {
    "l3-manager": "Senior Valuator",
    bank: "Bank Credit Officer",
    owner: "Property Owner",
    coordinator: "Coordinator",
    admin: "Administrator",
    "technical-officer": "Technical Officer",
  };
  return roleLabels[role || ""] || "User";
};

const MainLayout = ({
  children,
  activePage,
  onNavigate,
  role,
}: MainLayoutProps) => {
  const pageStyle: CSSProperties = {
    height: "100vh", // ✅ full screen height
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.background.default,
    overflow: "hidden", // ✅ prevents whole page scrolling
  };

  const headerWrapperStyle: CSSProperties = {
    flexShrink: 0, // ✅ header never shrinks
  };

  const bodyStyle: CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden", // ✅ prevents sidebar+content wrapper scrolling
  };

  const sidebarWrapperStyle: CSSProperties = {
    flexShrink: 0, // ✅ sidebar fixed width
    height: "100%",
    overflow: "hidden", // ✅ sidebar will not scroll
  };

  const contentWrapperStyle: CSSProperties = {
    flex: 1,
    height: "100%",
    overflow: "auto", // ✅ ONLY content scrolls
    padding: "24px",
  };

  return (
    <div style={pageStyle}>
      {/* Fixed Header */}
      <div style={headerWrapperStyle}>
        <Header userName="John Doe" userRole={getRoleLabel(role)} />
      </div>

      {/* Sidebar fixed + Content scroll */}
      <div style={bodyStyle}>
        <div style={sidebarWrapperStyle}>
          <Sidebar
            activePage={activePage}
            onNavigate={onNavigate}
            role={role}
          />
        </div>

        <main style={contentWrapperStyle}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;