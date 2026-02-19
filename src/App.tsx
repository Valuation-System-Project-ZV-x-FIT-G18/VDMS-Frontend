import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import RoleSelectPage from './pages/RoleSelectPage';
import TechnicalOfficerDashboard from './features/technical-officer/pages/Dashboard';

// ✅ Your Bank Credit Officer pages
import BankDashboardPage from './features/bank-credit-officer/pages/Dashboard';
import BankAllProjectsPage from './features/bank-credit-officer/pages/AllProjects';

// ✅ Your Property Owner pages
import OwnerDashboardPage from './features/property-owner/pages/Dashboard';
import OwnerAllProjectsPage from './features/property-owner/pages/AllProjects';

type Role =
  | 'bank'
  | 'owner'
  | 'admin'
  | 'coordinator'
  | 'technical-officer'
  | 'senior-valuator';

function BlankRolePage({ title }: { title: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <p style={{ marginTop: 8, color: '#6b7280' }}>
          This page is intentionally blank. The assigned member will build this dashboard.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [activePage, setActivePage] = useState('dashboard');

  const handleNavigation = (page: string) => setActivePage(page);

  // ✅ First show role selection page
  if (!role) {
    return (
      <RoleSelectPage
        onSelectRole={(selectedRole) => {
          setRole(selectedRole);
          setActivePage('dashboard');
        }}
      />
    );
  }

  // ✅ Other roles: show blank pages ONLY (no header/sidebar)
  if (role === 'admin') return <BlankRolePage title="Admin Portal" />;
  if (role === 'coordinator') return <BlankRolePage title="Coordinator Portal" />;
  if (role === 'senior-valuator') return <BlankRolePage title="Senior Valuator Portal" />;

  // ✅ Technical Officer: show dashboard
  if (role === 'technical-officer') {
    return <TechnicalOfficerDashboard />;
  }

  // ✅ Your roles: show real layout (sidebar + header)
  return (
    <MainLayout activePage={activePage} onNavigate={handleNavigation}>
      {/* Bank Credit Officer */}
      {role === 'bank' && activePage === 'dashboard' && <BankDashboardPage />}
      {role === 'bank' && activePage === 'projects' && <BankAllProjectsPage />}
      {role === 'bank' && activePage === 'payment' && <div>Payment Page (Coming Soon)</div>}

      {/* Property Owner */}
      {role === 'owner' && activePage === 'dashboard' && <OwnerDashboardPage />}
      {role === 'owner' && activePage === 'projects' && <OwnerAllProjectsPage />}
      {role === 'owner' && activePage === 'payment' && <div>Owner Payment (Coming Soon)</div>}
    </MainLayout>
  );
}

export default App;
