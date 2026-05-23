// Mock data persistence utility using localStorage
// This allows CRUD operations to persist across page refreshes

import type { User } from '../services/userService';
import type { ValuationType } from '../services/valuationTypeService';
import type { Template } from '../services/templateService';
import type { ValuationJob } from '../services/valuationJobService';

const STORAGE_KEYS = {
  USERS: 'vdms_mock_users',
  VALUATION_JOBS: 'vdms_mock_valuation_jobs',
  VALUATION_TYPES: 'vdms_mock_valuation_types',
  TEMPLATES: 'vdms_mock_templates',
} as const;

export const mockStorage = {
  // Generic storage methods
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  // User-specific methods
  getUsers: (): User[] => mockStorage.get(STORAGE_KEYS.USERS, getDefaultUsers()),
  setUsers: (users: User[]) => mockStorage.set(STORAGE_KEYS.USERS, users),

  // Valuation job methods
  getValuationJobs: (): ValuationJob[] => mockStorage.get(STORAGE_KEYS.VALUATION_JOBS, getDefaultValuationJobs()),
  setValuationJobs: (jobs: ValuationJob[]) => mockStorage.set(STORAGE_KEYS.VALUATION_JOBS, jobs),

  // Valuation type methods
  getValuationTypes: (): ValuationType[] => mockStorage.get(STORAGE_KEYS.VALUATION_TYPES, getDefaultValuationTypes()),
  setValuationTypes: (types: ValuationType[]) => mockStorage.set(STORAGE_KEYS.VALUATION_TYPES, types),

  // Template methods
  getTemplates: (): Template[] => mockStorage.get(STORAGE_KEYS.TEMPLATES, getDefaultTemplates()),
  setTemplates: (templates: Template[]) => mockStorage.set(STORAGE_KEYS.TEMPLATES, templates),
};

// Default mock data
function getDefaultUsers() {
  return [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "admin@zavolt.com",
      role: "admin",
      department: "IT & Systems",
      phone: "+1 (555) 123-4567",
      status: true,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "bank@zavolt.com",
      role: "bank",
      department: "Operations",
      phone: "+1 (555) 234-5678",
      status: true,
    },
    {
      id: "3",
      firstName: "Mike",
      lastName: "Johnson",
      email: "coordinator@zavolt.com",
      role: "coordinator",
      department: "Logistics",
      phone: "+1 (555) 345-6789",
      status: true,
    },
    {
      id: "4",
      firstName: "Sarah",
      lastName: "Williams",
      email: "technical-officer@zavolt.com",
      role: "technical-officer",
      department: "Field Operations",
      phone: "+1 (555) 456-7890",
      status: false,
    },
    {
      id: "5",
      firstName: "David",
      lastName: "Brown",
      email: "senior-valuator@zavolt.com",
      role: "senior-valuator",
      department: "Valuation",
      phone: "+1 (555) 567-8901",
      status: true,
    },
  ];
}

function getDefaultValuationJobs() {
  return [
    {
      id: "1",
      projectId: "PROJ-001",
      propertyAddress: "123 Main Street, Colombo 01",
      applicants: ["John Doe", "Jane Smith"],
      status: "in-progress",
      requestedDate: "2024-01-15",
      expectedCompletion: "2024-02-15",
      paymentStatus: "paid",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
    },
    {
      id: "2",
      projectId: "PROJ-002",
      propertyAddress: "456 Oak Avenue, Colombo 03",
      applicants: ["Mike Johnson"],
      status: "pending",
      requestedDate: "2024-01-20",
      expectedCompletion: "2024-02-20",
      paymentStatus: "pending",
      createdAt: "2024-01-20T09:15:00Z",
      updatedAt: "2024-01-20T09:15:00Z",
    },
    {
      id: "3",
      projectId: "PROJ-003",
      propertyAddress: "789 Pine Road, Colombo 05",
      applicants: ["Sarah Williams", "David Brown"],
      status: "completed",
      requestedDate: "2024-01-10",
      expectedCompletion: "2024-01-25",
      paymentStatus: "paid",
      createdAt: "2024-01-10T11:30:00Z",
      updatedAt: "2024-01-25T16:45:00Z",
    },
  ];
}

function getDefaultValuationTypes() {
  return [
    {
      id: "1",
      name: "Residential Property Valuation",
      description: "Complete valuation for residential properties including apartments, houses, and condominiums",
      category: "Residential",
      turnaroundTime: "5-7 business days",
      color: "#4F8EF7",
      background: "#EFF6FF",
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
      documents: [
        { id: "1", name: "Property Deed", isRequired: true, isGisValidated: true },
        { id: "2", name: "Tax Receipt", isRequired: true, isGisValidated: false },
        { id: "3", name: "Building Plan", isRequired: false, isGisValidated: true },
      ],
    },
    {
      id: "2",
      name: "Commercial Property Valuation",
      description: "Valuation services for commercial buildings, offices, and retail spaces",
      category: "Commercial",
      turnaroundTime: "7-10 business days",
      color: "#10B981",
      background: "#F0FDF4",
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
      documents: [
        { id: "4", name: "Business License", isRequired: true, isGisValidated: false },
        { id: "5", name: "Lease Agreement", isRequired: false, isGisValidated: false },
        { id: "6", name: "Financial Statements", isRequired: true, isGisValidated: false },
      ],
    },
    {
      id: "3",
      name: "Land Valuation",
      description: "Valuation for vacant land parcels and agricultural properties",
      category: "Land",
      turnaroundTime: "3-5 business days",
      color: "#F59E0B",
      background: "#FFFBEB",
      isActive: true,
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
      documents: [
        { id: "7", name: "Land Survey", isRequired: true, isGisValidated: true },
        { id: "8", name: "Zoning Certificate", isRequired: true, isGisValidated: true },
        { id: "9", name: "Environmental Report", isRequired: false, isGisValidated: false },
      ],
    },
  ];
}

function getDefaultTemplates() {
  return [
    {
      id: "1",
      title: "Residential Valuation Report Template",
      description: "Standard template for residential property valuation reports",
      category: "Reports",
      categoryColor: "#4F8EF7",
      categoryBg: "#EFF6FF",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
      status: "active",
      fileUrl: "/templates/residential-report.docx",
      fileName: "residential-report.docx",
      fileSize: "2.3 MB",
      fileUploadedAt: "2024-01-15T10:00:00Z",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      title: "Commercial Property Assessment Form",
      description: "Assessment form for commercial properties and buildings",
      category: "Forms",
      categoryColor: "#10B981",
      categoryBg: "#F0FDF4",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
      status: "active",
      fileUrl: "/templates/commercial-assessment.pdf",
      fileName: "commercial-assessment.pdf",
      fileSize: "1.8 MB",
      fileUploadedAt: "2024-01-20T14:30:00Z",
      createdAt: "2024-01-20T14:30:00Z",
      updatedAt: "2024-01-20T14:30:00Z",
    },
    {
      id: "3",
      title: "Land Valuation Certificate",
      description: "Certificate template for land valuation services",
      category: "Certificates",
      categoryColor: "#F59E0B",
      categoryBg: "#FFFBEB",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
      status: "draft",
      fileUrl: null,
      fileName: null,
      fileSize: null,
      fileUploadedAt: null,
      createdAt: "2024-01-25T09:15:00Z",
      updatedAt: "2024-01-25T09:15:00Z",
    },
  ];
}