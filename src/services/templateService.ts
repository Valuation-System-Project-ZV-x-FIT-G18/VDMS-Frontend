import api from './api';
import { mockStorage } from '../utils/mockStorage';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  image: string | null;
  status: string;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: string | null;
  fileUploadedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  title: string;
  description?: string;
  category: string;
  categoryColor?: string;
  categoryBg?: string;
  image?: string;
  status?: string;
}

const templateService = {
  getTemplates: async (): Promise<Template[]> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      // Return mock data from localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStorage.getTemplates();
    }

    const response = await api.get('/templates');
    return response.data;
  },

  getTemplate: async (id: string): Promise<Template> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const templates = mockStorage.getTemplates();
      const template = templates.find(t => t.id === id);
      if (!template) throw new Error("Template not found");
      return template;
    }

    const response = await api.get(`/templates/${id}`);
    return response.data;
  },
// For create/update/delete operations, we only support real API calls to avoid complexity of syncing mock data across clients. You can still test these operations by using the mock JWT and checking localStorage for changes.
  createTemplate: async (dto: CreateTemplateDto): Promise<Template> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const templates = mockStorage.getTemplates();
      const newTemplate: Template = {
        id: Date.now().toString(),
        title: dto.title,
        description: dto.description || '',
        category: dto.category,
        categoryColor: dto.categoryColor || '#4F8EF7',
        categoryBg: dto.categoryBg || '#EFF6FF',
        image: dto.image || null,
        status: dto.status || 'draft',
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileUploadedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      templates.push(newTemplate);
      mockStorage.setTemplates(templates);
      return newTemplate;
    }

    const response = await api.post('/templates', dto);
    return response.data;
  },

  updateTemplate: async (id: string, dto: Partial<CreateTemplateDto>): Promise<Template> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const templates = mockStorage.getTemplates();
      const templateIndex = templates.findIndex(t => t.id === id);
      if (templateIndex === -1) throw new Error("Template not found");

      templates[templateIndex] = { ...templates[templateIndex], ...dto, updatedAt: new Date().toISOString() };
      mockStorage.setTemplates(templates);
      return templates[templateIndex];
    }

    const response = await api.put(`/templates/${id}`, dto);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const templates = mockStorage.getTemplates();
      const templateIndex = templates.findIndex(t => t.id === id);
      if (templateIndex === -1) throw new Error("Template not found");
      templates.splice(templateIndex, 1);
      mockStorage.setTemplates(templates);
      return;
    }

    await api.delete(`/templates/${id}`);
  },

  uploadTemplateFile: async (id: string, file: File): Promise<Template> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const templates = mockStorage.getTemplates();
      const templateIndex = templates.findIndex(t => t.id === id);
      if (templateIndex === -1) throw new Error("Template not found");

      // Convert file to base64 for mock storage
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      };

      templates[templateIndex] = {
        ...templates[templateIndex],
        fileUrl: base64,
        fileName: file.name,
        fileSize: formatSize(file.size),
        fileUploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockStorage.setTemplates(templates);
      return templates[templateIndex];
    }

    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/templates/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeTemplateFile: async (id: string): Promise<Template> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const templates = mockStorage.getTemplates();
      const templateIndex = templates.findIndex(t => t.id === id);
      if (templateIndex === -1) throw new Error("Template not found");

      templates[templateIndex] = {
        ...templates[templateIndex],
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileUploadedAt: null,
        updatedAt: new Date().toISOString(),
      };
      mockStorage.setTemplates(templates);
      return templates[templateIndex];
    }

    const response = await api.delete(`/templates/${id}/file`);
    return response.data;
  },
};

export default templateService;
