import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import AllProjectsPage from './pages/AllProjectsPage';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const handleNavigation = (page: string) => {
    setActivePage(page);
    console.log('Navigating to:', page);
  };

  return (
    <MainLayout activePage={activePage} onNavigate={handleNavigation}>
      {activePage === 'dashboard' && <DashboardPage />}
      {activePage === 'projects' && <AllProjectsPage />}
      {activePage === 'payment' && <div>Payment Page (Coming Soon)</div>}
    </MainLayout>
  );
}

export default App;