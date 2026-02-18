import { useState } from "react";
import MainLayout from "./layouts/MainLayout";
import RoleSelectPage from "./pages/RoleSelectPage";

// ✅ Bank Credit Officer pages
import BankDashboardPage from "./features/bank-credit-officer/pages/Dashboard";
import BankAllProjectsPage from "./features/bank-credit-officer/pages/AllProjects";
import BankSettingsPage from "./features/bank-credit-officer/pages/Settings";

// ✅ Property Owner pages
import OwnerDashboardPage from "./features/property-owner/pages/Dashboard";
import OwnerAllProjectsPage from "./features/property-owner/pages/AllProjects";
import OwnerPaymentPage from "./features/property-owner/pages/Payment";
import OwnerSettingsPage from "./features/property-owner/pages/Settings";

// ✅ Your L3 Manager pages
import L3DashboardPage from "./features/l3/pages/Dashboard";
import L3AllProjectsPage from "./features/l3/pages/AllProjects";
import L3ApprovalsPage from "./features/l3/pages/Approvals";
import L3ReportsPage from "./features/l3/pages/Reports";
import L3DraftReportDetail from "./features/l3/pages/DraftReportDetail";

type Role =
  | "bank"
  | "owner"
  | "l3-manager"
  | "admin"
  | "coordinator"
  | "technical-officer"
  | "senior-valuator";

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

  const handleNavigation = (page: string, projectId?: string) => {
    setActivePage(page);
    if (projectId) setSelectedProjectId(projectId);
  };

  // ✅ Role selection first
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

  // ✅ Other roles: blank pages only
  if (role === "admin") return <BlankRolePage title="Admin Portal" />;
  if (role === "coordinator")
    return <BlankRolePage title="Coordinator Portal" />;
  if (role === "technical-officer")
    return <BlankRolePage title="Technical Officer Portal" />;
  if (role === "senior-valuator")
    return <BlankRolePage title="Senior Valuator Portal" />;

  // ✅ L3 Manager
  if (role === "l3-manager") {
    return (
      <MainLayout
        activePage={activePage}
        onNavigate={handleNavigation}
        role={role}
      >
        {activePage === "dashboard" && (
          <L3DashboardPage onNavigate={handleNavigation} />
        )}
        {activePage === "projects" && <L3AllProjectsPage />}
        {activePage === "approvals" && <L3ApprovalsPage />}
        {activePage === "reports" && <L3ReportsPage />}
        {activePage === "draft-review" && (
          <L3DraftReportDetail
            projectId={selectedProjectId || "PV-2024-8842"}
            onBack={() => setActivePage("dashboard")}
          />
        )}
      </MainLayout>
    );
  }

  // ✅ For bank/owner show layout
  return (
    <MainLayout
      activePage={activePage}
      onNavigate={handleNavigation}
      role={role}
    >
      {/* Bank Credit Officer */}
      {role === "bank" && activePage === "dashboard" && <BankDashboardPage />}
      {role === "bank" && activePage === "projects" && <BankAllProjectsPage />}
      {role === "bank" && activePage === "settings" && <BankSettingsPage />}

      {/* Property Owner */}
      {role === "owner" && activePage === "dashboard" && <OwnerDashboardPage />}
      {role === "owner" && activePage === "projects" && (
        <OwnerAllProjectsPage />
      )}
      {role === "owner" && activePage === "payment" && <OwnerPaymentPage />}
      {role === "owner" && activePage === "settings" && <OwnerSettingsPage />}
    </MainLayout>
  );
}

export default App;
