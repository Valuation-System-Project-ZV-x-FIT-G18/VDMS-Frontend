import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

export const fetchRejectedOfficers = async () => {
  try {
    const response = await API.get('/rejected-to');
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error.message : 'Failed to fetch rejected officers';
  }
};
