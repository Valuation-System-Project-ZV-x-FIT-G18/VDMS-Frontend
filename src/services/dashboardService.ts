import axiosInstance from '../api/axios';

export interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  pendingApprovals: number;
  bottlenecks: number;
  recentProjects: any[];
  [key: string]: any;
}

export const dashboardService = {
  async getStats() {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },

  async getMorningReport() {
    const response = await axiosInstance.get('/dashboard/morning-report');
    return response.data;
  },

  async getRecentProjects(limit?: number) {
    const response = await axiosInstance.get('/projects/recent', {
      params: limit ? { limit } : {},
    });
    return response.data;
  },
};