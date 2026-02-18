import type { CSSProperties, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { theme } from "../styles/theme";

interface MainLayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  userName: string;
  userRole: string;
  userType: 'credit_officer' | 'property_owner';
}

const MainLayout = ({ children, activePage, onNavigate, userName, userRole, userType }: MainLayoutProps) => {
  const pageStyle: CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.background.default,
    overflow: "hidden",
  };

  const headerWrapperStyle: CSSProperties = {
    flexShrink: 0,
  };

  const bodyStyle: CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  };

  const sidebarWrapperStyle: CSSProperties = {
    flexShrink: 0,
    height: "100%",
    overflow: "hidden",
  };

  const contentWrapperStyle: CSSProperties = {
    flex: 1,
    height: "100%",
    overflow: "auto",
    padding: "24px",
  };

  return (
    <div style={pageStyle}>
      {/* Fixed Header */}
      <div style={headerWrapperStyle}>
        <Header
          userName={userName}
          userRole={userRole}
        />
      </div>

      {/* Sidebar fixed + Content scroll */}
      <div style={bodyStyle}>
        <div style={sidebarWrapperStyle}>
          <Sidebar
            activePage={activePage}
            onNavigate={onNavigate}
            userType={userType}
          />
        </div>

        <main style={contentWrapperStyle}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;