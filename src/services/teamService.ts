import api from './api';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string | null;
  projectId: string;
}

export const teamService = {
  // Get all team members for a project
  getByProject: async (projectId: string): Promise<TeamMember[]> => {
    try {
      const response = await api.get<TeamMember[]>('/team-members', {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },
};