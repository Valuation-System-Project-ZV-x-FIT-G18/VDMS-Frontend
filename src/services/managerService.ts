import axiosInstance from '../api/axios';

export const managerService = {
  async getAll(role?: string) {
    const params: any = {};
    if (role) params.role = role;
    const response = await axiosInstance.get('/managers', { params });
    return response.data;
  },

  async getOne(id: string) {
    const response = await axiosInstance.get(`/managers/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await axiosInstance.post('/managers', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await axiosInstance.patch(`/managers/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await axiosInstance.delete(`/managers/${id}`);
    return response.data;
  },
};