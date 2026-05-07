import type { MenuConfig } from '../types/layout';

/* Role-based sidebar menus — each role gets its own set of navigation items */
export const menuConfig: MenuConfig = {
  coordinator: [
    { label: 'Dashboard',        path: '/coordinator/dashboard',       icon: '📊' },
    { label: 'New Valuation',    path: '/coordinator/search',          icon: '📝' },
    { label: 'Project Status',   path: '/coordinator/project-summary', icon: '📌' },
    { label: 'Fleet Management', path: '/coordinator/fleet-management', icon: '🚗' },
  ],
  'technical-officer': [
    { label: 'Dashboard', path: '/technical-officer/dashboard', icon: '📊' },
    { label: 'Projects', path: '/technical-officer/projects', icon: '📋' },
    { label: 'Reports', path: '/technical-officer/reports', icon: '📝' },
    { label: 'Documents', path: '/technical-officer/documents', icon: '📄' },
    { label: 'Attendance', path: '/technical-officer/attendance', icon: '🕒' },
    { label: 'Settings', path: '/technical-officer/settings', icon: '⚙️', position: 'bottom' },
  ],
  bank: [
    { label: 'Dashboard', path: '/bank/dashboard', icon: '📊' },
    { label: 'Projects', path: '/bank/projects', icon: '📝' },
    { label: 'Settings', path: '/bank/settings', icon: '⚙️', position: 'bottom' },
  ],
  owner: [
    { label: 'Dashboard', path: '/owner/dashboard', icon: '📊' },
    { label: 'Projects', path: '/owner/projects', icon: '📄' },
    { label: 'Payment', path: '/owner/payment', icon: '💳' },
    { label: 'Settings', path: '/owner/settings', icon: '⚙️', position: 'bottom' },
  ],
};
