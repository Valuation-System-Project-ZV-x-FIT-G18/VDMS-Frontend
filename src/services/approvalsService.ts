import axiosInstance from '../api/axios';

export const approvalsService = {
  async getAll(status?: string) {
    const params: any = {};
    if (status) params.status = status;
    const response = await axiosInstance.get('/approvals', { params });
    return response.data;
  },

  async getPending() {
    const response = await axiosInstance.get('/approvals', {
      params: { status: 'PENDING' },
    });
    return response.data;
  },

  async getProcessed() {
    const response = await axiosInstance.get('/approvals', {
      params: { status: 'APPROVED,REJECTED' },
    });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axiosInstance.get(`/approvals/${id}`);
    return response.data;
  },

  async approve(id: string, comments?: string) {
    const response = await axiosInstance.put(`/approvals/${id}`, {
      status: 'APPROVED',
      comments,
    });
    return response.data;
  },

  async reject(id: string, comments?: string) {
    const response = await axiosInstance.put(`/approvals/${id}`, {
      status: 'REJECTED',
      comments,
    });
    return response.data;
  },

  async create(data: any) {
    const response = await axiosInstance.post('/approvals', data);
    return response.data;
  },
};
