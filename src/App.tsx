import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import RoleSelectPage from './pages/RoleSelectPage';

// ✅ Your Bank Credit Officer pages
import BankDashboardPage from './features/bank-credit-officer/pages/Dashboard';
import BankAllProjectsPage from './features/bank-credit-officer/pages/AllProjects';
import SettingsPage from './features/bank-credit-officer/pages/Settings';

// ✅ Your Property Owner pages
import OwnerDashboardPage from './features/property-owner/pages/Dashboard';
import OwnerAllProjectsPage from './features/property-owner/pages/AllProjects';
import PaymentPage from './features/property-owner/pages/Payment';
import OwnerSettingsPage from './features/property-owner/pages/Settings';

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

// ✅ User info per role (later this will come from login/auth)
const roleConfig = {
  bank: {
    userName: 'John Doe',
    userRole: 'Senior Credit Officer',
    userType: 'credit_officer' as const,
  },
  owner: {
    userName: 'David Silva',
    userRole: 'Property Owner',
    userType: 'property_owner' as const,
  },
};

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
  if (role === 'technical-officer') return <BlankRolePage title="Technical Officer Portal" />;
  if (role === 'senior-valuator') return <BlankRolePage title="Senior Valuator Portal" />;

  // ✅ Get the right user info based on role
  const currentUser = roleConfig[role];

  // ✅ Your roles: show real layout (sidebar + header)
  return (
    <MainLayout
      activePage={activePage}
      onNavigate={handleNavigation}
      userName={currentUser.userName}
      userRole={currentUser.userRole}
      userType={currentUser.userType}
    >
      {/* Bank Credit Officer */}
      {role === 'bank' && activePage === 'dashboard' && <BankDashboardPage />}
      {role === 'bank' && activePage === 'projects' && <BankAllProjectsPage />}
      {role === 'bank' && activePage === 'settings' && <SettingsPage />}

      {/* Property Owner */}
      {role === 'owner' && activePage === 'dashboard' && <OwnerDashboardPage />}
      {role === 'owner' && activePage === 'projects' && <OwnerAllProjectsPage />}
      {role === 'owner' && activePage === 'payment' && <PaymentPage />}
     {role === 'owner' && activePage === 'settings' && <OwnerSettingsPage />}
    </MainLayout>
  );
}

export default App;