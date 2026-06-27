import api from './api';

export type InvoiceStatus = 'Overdue' | 'Pending' | 'Paid';

export interface Invoice {
  id: string;
  invoiceId: string;
  projectId: string;
  amount: string | number;
  dueDate: string;
  status: InvoiceStatus;
  paymentProofFileName: string | null;
  paymentProofUploadedAt: string | null;
  coordinatorNotifiedAt: string | null;
  project?: {
    id: string;
    projectId: string;
    propertyAddress: string;
    applicant?: string | null;
    clientId?: string | null;
  };
}

export interface InvoiceFilters {
  clientId?: string;
  search?: string;
  status?: InvoiceStatus;
}

export const invoiceService = {
  getAll: async (filters?: InvoiceFilters): Promise<Invoice[]> => {
    const params: Record<string, string> = {};

    if (filters?.clientId) {
      params.clientId = filters.clientId;
    }

    if (filters?.search) {
      params.search = filters.search;
    }

    if (filters?.status) {
      params.status = filters.status;
    }

    const response = await api.get<Invoice[]>('/invoices', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  uploadPaymentProof: async (id: string, fileName: string): Promise<Invoice> => {
    const response = await api.patch<Invoice>(`/invoices/${id}/payment-proof`, {
      fileName,
    });
    return response.data;
  },

  notifyCoordinator: async (id: string): Promise<Invoice> => {
    const response = await api.patch<Invoice>(`/invoices/${id}/notify`);
    return response.data;
  },
};
