import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000' });

export const fetchAvailableOfficers = async () => {
  try {
    const response = await API.get('/available-to');
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error.message : 'Failed to fetch available officers';
  }
};

export const fetchAllTechnicalOfficers = async () => {
  try {
    const response = await API.get('/fleet/all-officers');
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error.message : 'Failed to fetch all officers';
  }
};

