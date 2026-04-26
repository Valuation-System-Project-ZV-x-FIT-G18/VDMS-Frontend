import type { Project } from './projectService';
import { projectService } from './projectService';

export interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  pendingPayments: number;
  pendingDocuments: number;
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

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
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