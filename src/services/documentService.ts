import api from './api';

export interface Document {
  id: string;
  name: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  fileUrl: string | null;
  uploadedBy: string | null;
  required: boolean;
  note: string | null;
  projectId: string;
  uploadDate: string;
}

export const documentService = {
  // Get all documents for a project
  getByProject: async (projectId: string): Promise<Document[]> => {
    try {
      const response = await api.get<Document[]>('/documents', {
        params: { projectId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Get single document
  getById: async (id: string): Promise<Document> => {
    try {
      const response = await api.get<Document>(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },
};