import { useState, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { theme } from "../styles/theme";
import "./AppLayout.css";

interface MainLayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string, projectId?: string) => void;
  role?: string;
}

const getRoleLabel = (role?: string): string => {
  const roleLabels: Record<string, string> = {
    "l3-manager": "Senior Manager",
    "l2-manager": "Assistant General Manager",
    "l1-manager": "Managerial Director",
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageStyle: CSSProperties = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.background.default,
    overflow: "hidden",
    position: "relative",
  };

  const headerWrapperStyle: CSSProperties = {
    flexShrink: 0,
    zIndex: 40,
  };

  const bodyStyle: CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  };

  const sidebarWrapperStyle: CSSProperties = {
    flexShrink: 0,
    width: isMobile ? "200px" : "240px",
    height: "100%",
    overflow: "hidden",
    transition: "transform 0.3s ease",
    ...(isMobile && {
      position: "fixed",
      left: 0,
      top: "64px",
      zIndex: 30,
      width: "200px",
      boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
      transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
    }),
  };

  const contentWrapperStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    height: "100%",
    overflow: "auto",
    padding: 0,
  };

  const mobileOverlayStyle: CSSProperties = {
    position: "fixed",
    top: "64px",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 20,
    display: isMobileMenuOpen ? "block" : "none",
  };

  return (
    <div style={pageStyle}>
      {/* Fixed Header */}
      <div style={headerWrapperStyle}>
        <Header
          userName="John Doe"
          userRole={getRoleLabel(role)}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobile={isMobile}
          menuOpen={isMobileMenuOpen}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && (
        <div
          style={mobileOverlayStyle}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar + Content */}
      <div style={bodyStyle}>
        <div style={sidebarWrapperStyle}>
          <Sidebar
            activePage={activePage}
            onNavigate={(page: string) => {
              onNavigate(page);
              if (isMobile) {
                setIsMobileMenuOpen(false);
              }
            }}
            role={role}
          />
        </div>

        <main style={contentWrapperStyle}>{children}</main>
      </div>

      <FloatingChatWidget role={role} userNameHint="John Doe" />
    </div>
  );
};

export default MainLayout;
