import type { CSSProperties, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { theme } from "../styles/theme";

interface MainLayoutProps {
  children: ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const MainLayout = ({ children, activePage, onNavigate }: MainLayoutProps) => {
  const pageStyle: CSSProperties = {
    height: "100vh",             // ✅ full screen height
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.colors.background.default,
    overflow: "hidden",          // ✅ prevents whole page scrolling
  };

  const headerWrapperStyle: CSSProperties = {
    flexShrink: 0,               // ✅ header never shrinks
  };

  const bodyStyle: CSSProperties = {
    display: "flex",
    flex: 1,
    overflow: "hidden",          // ✅ prevents sidebar+content wrapper scrolling
  };

  const sidebarWrapperStyle: CSSProperties = {
    flexShrink: 0,               // ✅ sidebar fixed width
    height: "100%",
    overflow: "hidden",          // ✅ sidebar will not scroll
  };

  const contentWrapperStyle: CSSProperties = {
    flex: 1,
    height: "100%",
    overflow: "auto",            // ✅ ONLY content scrolls
    padding: "24px",
  };

  return (
    <div style={pageStyle}>
      {/* ✅ Fixed Header */}
      <div style={headerWrapperStyle}>
        <Header userName="John Doe" userRole="Senior Credit Officer" />
      </div>

      {/* ✅ Sidebar fixed + Content scroll */}
      <div style={bodyStyle}>
        <div style={sidebarWrapperStyle}>
          <Sidebar activePage={activePage} onNavigate={onNavigate} />
        </div>

        <main style={contentWrapperStyle}>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
