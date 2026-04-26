// TypeScript Types and Interfaces

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = 
  | 'property_owner' 
  | 'bank_credit_officer' 
  | 'technical_officer' 
  | 'coordinator' 
  | 'manager_l1' 
  | 'manager_l2' 
  | 'manager_l3';

export interface Project {
  id: string;
  valuationJobId?: string; // Preferred display field for valuation job flows
  projectId: string; // Display ID like "PROJ-2023-001"
  propertyAddress: string;
 applicants?: string[];
  status: ProjectStatus;
  requestedDate: string;
  expectedCompletion: string;
  paymentStatus: PaymentStatus;
}

export type ProjectStatus = 
  | 'Site Inspected'
  | 'Awaiting Docs'
  | 'Completed'
  | 'Payment Pending'
  | 'Report Prepared'
  | 'In Progress';

export type PaymentStatus = 'Paid' | 'Pending';

export interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  pendingPayment: number;
  pendingDocuments: number;
}