import api from './api';
import { mockStorage } from '../utils/mockStorage';

export interface ValuationDocument {
  id?: string;
  name: string;
  isRequired: boolean;
  isGisValidated: boolean;
}

export interface ValuationType {
  id: string;
  name: string;
  description: string;
  category: string;
  turnaroundTime: string;
  color: string;
  background: string;
  isActive: boolean;
  imageUrl: string;
  documents: ValuationDocument[];
}

export interface CreateValuationTypeDto {
  name: string;
  description?: string;
  category: string;
  turnaroundTime?: string;
  color?: string;
  background?: string;
  isActive?: boolean;
  imageUrl?: string;
  documents?: Omit<ValuationDocument, 'id'>[];
}

const valuationTypeService = {
  getTypes: async (): Promise<ValuationType[]> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      // Return mock data from localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStorage.getValuationTypes();
    }

    const response = await api.get('/valuation-types');
    return response.data;
  },

  getType: async (id: string): Promise<ValuationType> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const types = mockStorage.getValuationTypes();
      const type = types.find(t => t.id === id);
      if (!type) throw new Error("Valuation type not found");
      return type;
    }

    const response = await api.get(`/valuation-types/${id}`);
    return response.data;
  },

  createType: async (dto: CreateValuationTypeDto): Promise<ValuationType> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const types = mockStorage.getValuationTypes();
      const newType: ValuationType = {
        id: Date.now().toString(),
        name: dto.name,
        description: dto.description || '',
        category: dto.category,
        turnaroundTime: dto.turnaroundTime || '5-7 business days',
        color: dto.color || '#4F8EF7',
        background: dto.background || '#EFF6FF',
        isActive: dto.isActive ?? true,
        imageUrl: dto.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
        documents: (dto.documents || []).map(doc => ({
          id: Date.now().toString() + Math.random(),
          name: doc.name,
          isRequired: doc.isRequired,
          isGisValidated: doc.isGisValidated,
        })),
      };
      types.push(newType);
      mockStorage.setValuationTypes(types);
      return newType;
    }

    const response = await api.post('/valuation-types', dto);
    return response.data;
  },

  updateType: async (id: string, dto: Partial<CreateValuationTypeDto>): Promise<ValuationType> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const types = mockStorage.getValuationTypes();
      const typeIndex = types.findIndex(t => t.id === id);
      if (typeIndex === -1) throw new Error("Valuation type not found");

      const updatedType = { ...types[typeIndex] };
      if (dto.name !== undefined) updatedType.name = dto.name;
      if (dto.description !== undefined) updatedType.description = dto.description;
      if (dto.category !== undefined) updatedType.category = dto.category;
      if (dto.turnaroundTime !== undefined) updatedType.turnaroundTime = dto.turnaroundTime;
      if (dto.color !== undefined) updatedType.color = dto.color;
      if (dto.background !== undefined) updatedType.background = dto.background;
      if (dto.isActive !== undefined) updatedType.isActive = dto.isActive;
      if (dto.documents !== undefined) {
        updatedType.documents = dto.documents.map(doc => ({
          id: Date.now().toString() + Math.random(),
          name: doc.name,
          isRequired: doc.isRequired,
          isGisValidated: doc.isGisValidated,
        }));
      }
      types[typeIndex] = updatedType;
      mockStorage.setValuationTypes(types);
      return types[typeIndex];
    }

    const response = await api.put(`/valuation-types/${id}`, dto);
    return response.data;
  },

  deleteType: async (id: string): Promise<void> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const types = mockStorage.getValuationTypes();
      const typeIndex = types.findIndex(t => t.id === id);
      if (typeIndex === -1) throw new Error("Valuation type not found");
      types.splice(typeIndex, 1);
      mockStorage.setValuationTypes(types);
      return;
    }

    await api.delete(`/valuation-types/${id}`);
  },
};

export default valuationTypeService;
