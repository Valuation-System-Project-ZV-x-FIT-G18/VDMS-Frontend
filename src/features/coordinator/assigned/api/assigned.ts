import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000' });

// Fetch all assigned officers
export const fetchAssignedOfficers = async () => {
  try {
    const response = await API.get('/assigned');
    return response.data; // Array of assigned officers with details
  } catch (error) {
    throw error instanceof Error ? error.message : 'Failed to fetch assigned officers';
  }
};

// Fetch assigned officers for a specific project
export const fetchByProject = async (projectId: string) => {
  try {
    const response = await API.get('/assigned/project', { params: { projectId } });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error.message : 'Failed to fetch project assignments';
  }
};

