import axiosInstance from '../api/axios';

export interface ProjectDetails {
  id: string;
  valuationJobId?: string;
  projectId: string;
  status: string;
  paymentStatus: string;
  [key: string]: any;
}

export interface Project {
  id: string;
  valuationJobId?: string;
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

export const projectService = {
  async getAll(status?: string, search?: string) {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await axiosInstance.get('/projects', { params });
    return response.data;
  },

const normalizeValuationJobId = (id?: string): string => {
  if (!id) return '';
  return id.startsWith('PROJ-') ? id.replace('PROJ-', 'VAL-') : id;
};

const toProject = (project: ApiProject): Project => ({
  ...project,
  valuationJobId: normalizeValuationJobId(project.valuationJobId ?? project.projectId),
  projectId: normalizeValuationJobId(project.projectId ?? project.valuationJobId ?? ''),
  applicants: project.applicants ?? (project.applicant ? [project.applicant] : []),
  status: isProjectStatus(project.status) ? project.status : 'In Progress',
  paymentStatus: isPaymentStatus(project.paymentStatus) ? project.paymentStatus : 'Pending',
});

  async getRecent() {
    const response = await axiosInstance.get('/projects/recent');
    return response.data;
  },

  async getOne(id: string) {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
  },

  async getPending() {
    const response = await axiosInstance.get('/projects', {
      params: { status: 'Needs Review,Payment Pending' },
    });
    return response.data;
  },

  async getCompleted() {
    const response = await axiosInstance.get('/projects', {
      params: { status: 'Completed' },
    });
    return response.data;
  },

  async getRejected() {
    const response = await axiosInstance.get('/projects', {
      params: { status: 'Rejected' },
    });
    return response.data;
  },

  async create(data: any) {
    const response = await axiosInstance.post('/projects', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await axiosInstance.patch(`/projects/${id}`, data);
    return response.data;
  },
};