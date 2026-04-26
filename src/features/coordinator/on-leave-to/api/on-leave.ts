import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000' });

export const fetchOnLeaveOfficers = async () => {
  try {
    const response = await API.get('/on-leave-to');
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error.message : 'Failed to fetch on-leave officers';
  }
};
