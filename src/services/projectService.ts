import axiosInstance from '../api/axios';

export interface ProjectDetails {
  id: string;
  projectId: string;
  status: string;
  paymentStatus: string;
  [key: string]: any;
}

export interface Project extends ProjectDetails {}

export const projectService = {
  async getAll(status?: string, search?: string) {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;
    const response = await axiosInstance.get('/projects', { params });
    return response.data;
  },

  async getStats() {
    const response = await axiosInstance.get('/projects/stats');
    return response.data;
  },

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