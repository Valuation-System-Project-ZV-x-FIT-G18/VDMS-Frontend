import api from './api';
import type { PaymentStatus, ProjectStatus } from '../features/bank-credit-officer/types';
import type { Document } from './documentService';
import type { TeamMember } from './teamService';

// Type definitions
interface ApiProject {
  id: string;
  projectId: string;
  propertyAddress: string;
  applicant?: string | null;
  applicants?: string[];
  status: string;
  requestedDate: string;
  expectedCompletion: string;
  paymentStatus: string;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  projectId: string;
  propertyAddress: string;
  applicants?: string[];
  status: ProjectStatus;
  requestedDate: string;
  expectedCompletion: string;
  paymentStatus: PaymentStatus;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ✅ NEW: Extended interface for project details with relations
export interface ProjectDetails extends Project {
  documents?: Document[];
  teamMembers?: TeamMember[];
}

export interface ProjectFilters {
  status?: string;
  paymentStatus?: string;
  search?: string;
  clientId?: string;
}

const PROJECT_STATUSES: ProjectStatus[] = [
  'Site Inspected',
  'Awaiting Docs',
  'Completed',
  'Payment Pending',
  'Report Prepared',
  'In Progress',
];

const PAYMENT_STATUSES: PaymentStatus[] = ['Paid', 'Pending'];

const isProjectStatus = (value: string): value is ProjectStatus =>
  PROJECT_STATUSES.includes(value as ProjectStatus);

const isPaymentStatus = (value: string): value is PaymentStatus =>
  PAYMENT_STATUSES.includes(value as PaymentStatus);

const toProject = (project: ApiProject): Project => ({
  ...project,
  applicants: project.applicants ?? (project.applicant ? [project.applicant] : []),
  status: isProjectStatus(project.status) ? project.status : 'In Progress',
  paymentStatus: isPaymentStatus(project.paymentStatus) ? project.paymentStatus : 'Pending',
});

// API Functions
export const projectService = {
  // Get all projects with optional filters
  getAll: async (filters?: ProjectFilters): Promise<Project[]> => {
    try {
      const params: Record<string, string> = {};
      
      if (filters?.status && filters.status !== 'All') {
        params.status = filters.status;
      }
      
      if (filters?.paymentStatus && filters.paymentStatus !== 'All') {
        params.paymentStatus = filters.paymentStatus;
      }
      
      if (filters?.search) {
        params.search = filters.search;
      }

      if (filters?.clientId) {
        params.clientId = filters.clientId;
      }

      const response = await api.get<ApiProject[]>('/projects', { params });
      return response.data.map(toProject);
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get single project by ID
  getById: async (id: string): Promise<Project> => {
    try {
      const response = await api.get<ApiProject>(`/projects/${id}`);
      return toProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // ✅ NEW: Get project with full details (documents, team members)
  getDetails: async (id: string): Promise<ProjectDetails> => {
    try {
      const response = await api.get<ApiProject>(`/projects/${id}`);
      return toProject(response.data) as ProjectDetails;
    } catch (error) {
      console.error('Error fetching project details:', error);
      throw error;
    }
  },

  // Get recent projects (for dashboard)
  getRecent: async (limit: number = 5, filters?: Pick<ProjectFilters, 'clientId'>): Promise<Project[]> => {
    try {
      const params: Record<string, string | number> = { limit };
      if (filters?.clientId) {
        params.clientId = filters.clientId;
      }

      const response = await api.get<ApiProject[]>('/projects/recent', { params });
      return response.data.map(toProject);
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      throw error;
    }
  },
};