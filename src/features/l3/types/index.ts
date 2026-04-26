// TypeScript Types and Interfaces for L3 Managers

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager_l3';
  avatar?: string;
}

export interface Project {
  id: string;
  projectId: string; // Display ID like "PROJ-2026-001"
  propertyAddress: string;
  applicant?: string;
  status: ProjectStatus;
  requestedDate: string;
  expectedCompletion: string;
  paymentStatus: PaymentStatus;
  technicalOfficer?: string;
  coordinator?: string;
}

export type ProjectStatus =
  | 'Site Inspected'
  | 'Awaiting Docs'
  | 'Completed'
  | 'Payment Pending'
  | 'Report Prepared'
  | 'In Progress'
  | 'Needs Review'
  | 'Rejected';

export type PaymentStatus = 'Paid' | 'Pending';

export interface DashboardStats {
  totalProjects: number;
  reviewPending: number;
  approvedProjects: number;
  rejectedProjects: number;
  totalRevenue: number;
  pendingApprovals: number;
  completionRate: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'technical_officer' | 'coordinator';
  activeProjects: number;
  completedProjects: number;
  workload: 'Low' | 'Medium' | 'High';
}

export interface ApprovalItem {
  projectId: string;
  propertyAddress: string;
  submittedBy: string;
  submittedDate: string;
  priority: 'Low' | 'Medium' | 'High';
  approvalType: 'Document Review' | 'Report Approval' | 'Payment Authorization';
}
