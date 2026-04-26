import { Outlet } from 'react-router-dom';                // renders child routes
import MainLayout from './MainLayout';

/* Coordinator-specific layout — wraps all /coordinator/* routes with sidebar + topbar */
const CoordinatorLayout = () => (
  <MainLayout
    role="coordinator"
    activePage="/coordinator/dashboard"
    onNavigate={() => {}}
  >
    <Outlet />
  </MainLayout>
);

export default CoordinatorLayout;
