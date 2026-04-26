import type { Role } from '../types';

/* Central list of all 7 roles — single source of truth for the landing page */
export const roles: Role[] = [
  { id: 'coordinator',       label: 'Coordinator',       color: '#4A90D9' }, // blue
  { id: 'technical-officer',  label: 'Technical Officer',  color: '#50B87D' }, // green
  { id: 'l1-manager',         label: 'L1 Manager',         color: '#E8873D' }, // orange
  { id: 'l2-manager',         label: 'L2 Manager',         color: '#9B59B6' }, // purple
  { id: 'l3-manager',         label: 'L3 Manager',         color: '#E74C3C' }, // red
  { id: 'bank',               label: 'Bank',               color: '#1ABC9C' }, // teal
  { id: 'loan-applicant',     label: 'Loan Applicant',     color: '#F39C12' }, // yellow-orange
];
