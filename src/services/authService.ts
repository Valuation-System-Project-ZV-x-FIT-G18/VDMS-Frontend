import axiosInstance from '../api/axios';

export const authService = {
  async login(email: string, password: string) {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { accessToken, manager } = response.data;
    localStorage.setItem('vdms_token', accessToken);
    localStorage.setItem('vdms_manager', JSON.stringify(manager));
    return response.data;
  },

  async logout() {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('vdms_token');
      localStorage.removeItem('vdms_manager');
    }
  },

  async getProfile() {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  getCurrentManager() {
    const manager = localStorage.getItem('vdms_manager');
    return manager ? JSON.parse(manager) : null;
  },

  isLoggedIn() {
    return !!localStorage.getItem('vdms_token');
  },
};