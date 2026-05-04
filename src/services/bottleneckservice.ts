import axiosInstance from '../api/axios';

export const bottleneckService = {
  async getAll() {
    const response = await axiosInstance.get('/bottlenecks');
    return response.data;
  },

  async getStats() {
    const response = await axiosInstance.get('/bottlenecks/stats');
    return response.data;
  },
};