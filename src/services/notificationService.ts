import axiosInstance from '../api/axios';

export interface Notification {
  id: string;
  managerId: string;
  type: string;
  message: string;
  title?: string;
  isRead: boolean;
  projectId?: string;
  created_at: string;
  createdAt?: string;
}

export const notificationService = {
  async getAll() {
    const manager = JSON.parse(localStorage.getItem('vdms_manager') || '{}');
    const response = await axiosInstance.get('/notifications', {
      params: { managerId: manager.id },
    });
    return response.data;
  },

  async markRead(id: string) {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllRead() {
    const manager = JSON.parse(localStorage.getItem('vdms_manager') || '{}');
    const response = await axiosInstance.patch('/notifications/mark-all-read', {
      managerId: manager.id,
    });
    return response.data;
  },
};