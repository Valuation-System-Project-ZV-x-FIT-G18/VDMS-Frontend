import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import RoleSelectPage from "./pages/RoleSelectPage";

// ✅ Your Bank Credit Officer pages
import BankDashboardPage from "./features/bank-credit-officer/pages/Dashboard";
import BankAllProjectsPage from "./features/bank-credit-officer/pages/AllProjects";

// ✅ Your Property Owner pages
import OwnerDashboardPage from "./features/property-owner/pages/Dashboard";
import OwnerAllProjectsPage from "./features/property-owner/pages/AllProjects";

// ✅ Your L3 Manager pages
import L3DashboardPage from "./features/l3/pages/Dashboard";
import L3AllProjectsPage from "./features/l3/pages/AllProjects";
import L3ApprovalsPage from "./features/l3/pages/Approvals";
import L3ReportsPage from "./features/l3/pages/Reports";
import L3DraftReportDetail from "./features/l3/pages/DraftReportDetail";

type Role =
  | "bank"
  | "owner"
  | "admin"
  | "coordinator"
  | "technical-officer"
  | "l3-manager";

function BlankRolePage({ title }: { title: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p style={{ marginTop: 8, color: "#6b7280" }}>
          This page is intentionally blank. The assigned member will build this
          dashboard.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  // ✅ First show role selection page
  if (!role) {
    return (
      <RoleSelectPage
        onSelectRole={(selectedRole) => {
          setRole(selectedRole);
          setActivePage("dashboard");
        }}
      />
    );
  }

  // ✅ Other roles: show blank pages ONLY (no header/sidebar)
  if (role === "admin") return <BlankRolePage title="Admin Portal" />;
  if (role === "coordinator")
    return <BlankRolePage title="Coordinator Portal" />;
  if (role === "technical-officer")
    return <BlankRolePage title="Technical Officer Portal" />;

  // ✅ Your roles: show real layout (sidebar + header)
  return (
    <MainLayout
      activePage={activePage}
      onNavigate={(page, projectId) => {
        setActivePage(page);
        if (projectId) setSelectedProjectId(projectId);
      }}
      role={role}
    >
      {/* Bank Credit Officer */}
      {role === "bank" && activePage === "dashboard" && <BankDashboardPage />}
      {role === "bank" && activePage === "projects" && <BankAllProjectsPage />}
      {role === "bank" && activePage === "payment" && (
        <div>Payment Page (Coming Soon)</div>
      )}

      {/* Property Owner */}
      {role === "owner" && activePage === "dashboard" && <OwnerDashboardPage />}
      {role === "owner" && activePage === "projects" && (
        <OwnerAllProjectsPage />
      )}
      {role === "owner" && activePage === "payment" && (
        <div>Owner Payment (Coming Soon)</div>
      )}

      {/* L3 Manager */}
      {role === "l3-manager" && activePage === "dashboard" && (
        <L3DashboardPage
          onNavigate={(page, projectId) => {
            setActivePage(page);
            if (projectId) setSelectedProjectId(projectId);
          }}
        />
      )}
      {role === "l3-manager" && activePage === "projects" && (
        <L3AllProjectsPage />
      )}
      {role === "l3-manager" && activePage === "approvals" && (
        <L3ApprovalsPage />
      )}
      {role === "l3-manager" && activePage === "reports" && <L3ReportsPage />}
      {role === "l3-manager" && activePage === "draft-review" && (
        <L3DraftReportDetail
          projectId={selectedProjectId || "PV-2024-8842"}
          onBack={() => setActivePage("dashboard")}
        />
      )}
    </MainLayout>
  );
}

export default App;
