import axiosInstance from '../api/axios';

export const approvalService = {
  async getAll() {
    const response = await axiosInstance.get('/approvals');
    return response.data;
  },

  async getPending(managerId?: string) {
    const params: any = {};
    if (managerId) params.managerId = managerId;
    const response = await axiosInstance.get('/approvals/pending', { params });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axiosInstance.get(`/approvals/${id}`);
    return response.data;
  },

  async getByProject(projectId: string) {
    const response = await axiosInstance.get(`/approvals/project/${projectId}`);
    return response.data;
  },

  async approve(id: string, comments: string) {
    const manager = JSON.parse(localStorage.getItem('vdms_manager') || '{}');
    const response = await axiosInstance.patch(`/approvals/${id}/approve`, {
      comments,
      managerId: manager.id,
    });
    return response.data;
  },

  async reject(id: string, comments: string) {
    const manager = JSON.parse(localStorage.getItem('vdms_manager') || '{}');
    const response = await axiosInstance.patch(`/approvals/${id}/reject`, {
      comments,
      managerId: manager.id,
    });
    return response.data;
  },

  async create(data: any) {
    const response = await axiosInstance.post('/approvals', data);
    return response.data;
  },
};