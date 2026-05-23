import api from './api';
import { mockStorage } from '../utils/mockStorage';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  status: boolean;
  photo?: string;
  password?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  department?: string;
  phone?: string;
}

const userService = {
  getUsers: async (): Promise<User[]> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      // Return mock data from localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStorage.getUsers();
    }

    const response = await api.get('/users');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (data?.users && Array.isArray(data.users)) return data.users;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  },

  getUser: async (id: string): Promise<User> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const users = mockStorage.getUsers();
      const user = users.find(u => u.id === id);
      if (!user) throw new Error("User not found");
      return user;
    }

    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (dto: CreateUserDto): Promise<User> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const users = mockStorage.getUsers();
      const newUser: User = {
        id: Date.now().toString(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        role: dto.role,
        password: dto.password,
        department: dto.department || '',
        phone: dto.phone || '',
        status: true,
      };
      users.push(newUser);
      mockStorage.setUsers(users);
      return newUser;
    }

    const response = await api.post('/users', dto);
    return response.data;
  },

  updateUser: async (id: string, dto: Partial<CreateUserDto>): Promise<User> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const users = mockStorage.getUsers();
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error("User not found");

      users[userIndex] = { ...users[userIndex], ...dto };
      mockStorage.setUsers(users);
      return users[userIndex];
    }

    const response = await api.put(`/users/${id}`, dto);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const users = mockStorage.getUsers();
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error("User not found");
      users.splice(userIndex, 1);
      mockStorage.setUsers(users);
      return;
    }

    await api.delete(`/users/${id}`);
  },

  getStats: async (): Promise<{ total: number; active: number }> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const users = mockStorage.getUsers();
      const active = users.filter(u => u.status ?? true).length;
      return { total: users.length, active };
    }

    const response = await api.get('/users/stats');
    return response.data;
  },
};

export default userService;
