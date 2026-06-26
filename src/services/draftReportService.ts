import axiosInstance from '../api/axios';

export const draftReportService = {
  async getAll(status?: string) {
    const params: any = {};
    if (status) params.status = status;
    const response = await axiosInstance.get('/draft-reports', { params });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axiosInstance.get(`/draft-reports/${id}`);
    return response.data;
  },

  async getByProject(projectId: string) {
    const response = await axiosInstance.get(`/draft-reports/project/${projectId}`);
    return response.data;
  },

  async getVersionHistory(projectId: string) {
    const response = await axiosInstance.get(`/draft-reports/versions/${projectId}`);
    return response.data;
  },

  async getFinalized() {
    const response = await axiosInstance.get('/draft-reports', {
      params: { status: 'LOCKED' },
    });
    return response.data;
  },

  async create(data: any) {
    const response = await axiosInstance.post('/draft-reports', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await axiosInstance.patch(`/draft-reports/${id}`, data);
    return response.data;
  },

  async approveL3(id: string, comments: string) {
    const manager = JSON.parse(localStorage.getItem('vdms_manager') || '{}');
    const response = await axiosInstance.patch(`/draft-reports/${id}/approve-l3`, {
      managerId: manager.id,
      comments,
    });
    return response.data;
  },

  async approveL2(id: string, comments: string) {
    const manager = JSON.parse(localStorage.getItem('vdms_manager') || '{}');
    const response = await axiosInstance.patch(`/draft-reports/${id}/approve-l2`, {
      managerId: manager.id,
      comments,
    });
    return response.data;
  },

  async approveL1(id: string, comments: string) {
    const manager = JSON.parse(localStorage.getItem('vdms_manager') || '{}');
    const response = await axiosInstance.patch(`/draft-reports/${id}/approve-l1`, {
      managerId: manager.id,
      comments,
    });
    return response.data;
  },

  async lock(id: string) {
    const response = await axiosInstance.patch(`/draft-reports/${id}/lock`);
    return response.data;
  },

  async reject(id: string, reason: string, feedback: string) {
    const response = await axiosInstance.patch(`/draft-reports/${id}/reject`, {
      reason,
      feedback,
    });
    return response.data;
  },
};