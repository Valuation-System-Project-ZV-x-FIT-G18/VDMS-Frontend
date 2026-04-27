import api from './api';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  event: string;
  title: string;
  message: string;
  recipientId: string;
  recipientRole: string;
  projectId: string | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {

  // Get all notifications for a user
  getForUser: async (recipientId: string): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications', {
      params: { recipientId },
    });
    return response.data;
  },

  // Mark one as read
  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async (recipientId: string): Promise<void> => {
    await api.patch('/notifications/mark-all-read', null, {
      params: { recipientId },
    });
  },
};