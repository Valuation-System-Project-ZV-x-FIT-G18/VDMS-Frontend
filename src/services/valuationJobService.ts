import api from './api';
import { mockStorage } from '../utils/mockStorage';

export interface ValuationJob {
  id: string;
  projectId: string;
  propertyAddress: string;
  applicants: string[];
  status: string;
  requestedDate: string;
  expectedCompletion: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  pendingPayment: number;
  pendingDocuments: number;
}

const valuationJobService = {
  getJobs: async (): Promise<ValuationJob[]> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      // Return mock data from localStorage
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockStorage.getValuationJobs();
    }

    const response = await api.get('/valuation-jobs');
    return response.data;
  },

  getStats: async (): Promise<JobStats> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const jobs = mockStorage.getValuationJobs();
      const completed = jobs.filter(job => job.status === 'completed').length;
      const active = jobs.filter(job => job.status === 'in-progress').length;
      const pendingPayment = jobs.filter(job => job.paymentStatus === 'pending').length;
      const pendingDocuments = jobs.filter(job => job.status === 'pending').length;

      return {
        totalProjects: jobs.length,
        completedProjects: completed,
        activeProjects: active,
        pendingPayment: pendingPayment,
        pendingDocuments: pendingDocuments,
      };
    }

    const response = await api.get('/valuation-jobs/stats');
    return response.data;
  },

  getJob: async (id: string): Promise<ValuationJob> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const jobs = mockStorage.getValuationJobs();
      const job = jobs.find(j => j.id === id);
      if (!job) throw new Error("Job not found");
      return job;
    }

    const response = await api.get(`/valuation-jobs/${id}`);
    return response.data;
  },

  createJob: async (data: Partial<ValuationJob>): Promise<ValuationJob> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const jobs = mockStorage.getValuationJobs();
      const newJob: ValuationJob = {
        id: Date.now().toString(),
        projectId: data.projectId || `PROJ-${Date.now()}`,
        propertyAddress: data.propertyAddress || '',
        applicants: data.applicants || [],
        status: data.status || 'pending',
        requestedDate: data.requestedDate || new Date().toISOString().split('T')[0],
        expectedCompletion: data.expectedCompletion || '',
        paymentStatus: data.paymentStatus || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      jobs.push(newJob);
      mockStorage.setValuationJobs(jobs);
      return newJob;
    }

    const response = await api.post('/valuation-jobs', data);
    return response.data;
  },

  updateJob: async (id: string, data: Partial<ValuationJob>): Promise<ValuationJob> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const jobs = mockStorage.getValuationJobs();
      const jobIndex = jobs.findIndex(j => j.id === id);
      if (jobIndex === -1) throw new Error("Job not found");

      jobs[jobIndex] = { ...jobs[jobIndex], ...data, updatedAt: new Date().toISOString() };
      mockStorage.setValuationJobs(jobs);
      return jobs[jobIndex];
    }

    const response = await api.put(`/valuation-jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    // Check if using mock authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token?.startsWith("mock-jwt-")) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const jobs = mockStorage.getValuationJobs();
      const jobIndex = jobs.findIndex(j => j.id === id);
      if (jobIndex === -1) throw new Error("Job not found");
      jobs.splice(jobIndex, 1);
      mockStorage.setValuationJobs(jobs);
      return;
    }

    await api.delete(`/valuation-jobs/${id}`);
  },
};

export default valuationJobService;
