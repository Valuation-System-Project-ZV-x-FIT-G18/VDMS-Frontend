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
  // Get dashboard statistics
  getStats: async (clientId?: string): Promise<DashboardStats> => {
    try {
      // Use normalized project mapping from projectService
      const projects = await projectService.getAll({ clientId });

      const stats: DashboardStats = {
        totalProjects: projects.length,
        completedProjects: projects.filter(p => p.status === 'Completed').length,
        activeProjects: projects.filter(p => 
          p.status === 'In Progress' || 
          p.status === 'Site Inspected' || 
          p.status === 'Report Prepared'
        ).length,
        pendingPayments: projects.filter(p => p.paymentStatus === 'Pending').length,
        pendingDocuments: projects.filter(p => p.status === 'Awaiting Docs').length,
      };

  async getMorningReport() {
    const response = await axiosInstance.get('/dashboard/morning-report');
    return response.data;
  },

  // Get recent projects
  getRecentProjects: async (limit: number = 5, clientId?: string): Promise<Project[]> => {
    try {
      return await projectService.getRecent(limit, { clientId });
    } catch (error) {
      console.error('Error fetching recent projects:', error);
      throw error;
    }
  },
};