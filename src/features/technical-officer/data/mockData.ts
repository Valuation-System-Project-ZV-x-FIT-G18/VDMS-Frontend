export type ProjectStatus = "Assigned" | "In Progress" | "Pending Review" | "Completed" | "Overdue";

export interface AssignedProject {
  id: string;
  clientName: string;
  location: string;
  deadline: string;
  status: ProjectStatus;
  progress: number;
}

export type DocumentStatus = "Uploaded" | "OCR Ready" | "Pending Review" | "Approved";

export interface ProjectDocument {
  id: string;
  projectId: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  status: DocumentStatus;
}

export type ReportStatus = "Draft" | "Pending Review";

export interface DraftReport {
  id: string;
  projectId: string;
  title: string;
  inspectionNotes: string;
  valuationSummary: string;
  recommendation: string;
  status: ReportStatus;
}

export interface OcrFields {
  planNo: string;
  lotNo: string;
  ownerName: string;
  propertyLocation: string;
  surveyDate: string;
}

export const assignedProjects: AssignedProject[] = [
  {
    id: "VAL-2024-089",
    clientName: "Henderson Properties",
    location: "Colombo 07",
    deadline: "2026-05-08",
    status: "In Progress",
    progress: 60,
  },
  {
    id: "VAL-2024-092",
    clientName: "Sarah Mitchell",
    location: "Nugegoda",
    deadline: "2026-05-12",
    status: "Assigned",
    progress: 40,
  },
  {
    id: "VAL-2024-087",
    clientName: "Metro Development Corp",
    location: "Kandy",
    deadline: "2026-05-04",
    status: "Pending Review",
    progress: 85,
  },
  {
    id: "VAL-2024-085",
    clientName: "Johnson Family Trust",
    location: "Galle",
    deadline: "2026-04-24",
    status: "Overdue",
    progress: 30,
  },
];

export const initialDocuments: ProjectDocument[] = [
  {
    id: "DOC-001",
    projectId: "VAL-2024-089",
    documentType: "Survey Plan",
    fileName: "henderson-survey-plan.pdf",
    uploadDate: "2026-04-20",
    status: "OCR Ready",
  },
  {
    id: "DOC-002",
    projectId: "VAL-2024-089",
    documentType: "Inspection Photos",
    fileName: "site-photos.zip",
    uploadDate: "2026-04-21",
    status: "Uploaded",
  },
  {
    id: "DOC-003",
    projectId: "VAL-2024-092",
    documentType: "Deed",
    fileName: "client-deed.pdf",
    uploadDate: "2026-04-22",
    status: "Uploaded",
  },
  {
    id: "DOC-004",
    projectId: "VAL-2024-087",
    documentType: "Valuation Notes",
    fileName: "metro-field-notes.docx",
    uploadDate: "2026-04-23",
    status: "OCR Ready",
  },
];

export const initialReports: DraftReport[] = [
  {
    id: "RPT-089",
    projectId: "VAL-2024-089",
    title: "Draft Valuation Report",
    inspectionNotes: "Boundary and access road verified during site visit.",
    valuationSummary: "Residential property with stable comparable market demand.",
    recommendation: "Proceed with manager review after document verification.",
    status: "Draft",
  },
  {
    id: "RPT-092",
    projectId: "VAL-2024-092",
    title: "Initial Inspection Report",
    inspectionNotes: "Site inspection scheduled; ownership documents received.",
    valuationSummary: "Preliminary value range pending OCR verification.",
    recommendation: "Complete OCR review before final draft update.",
    status: "Draft",
  },
  {
    id: "RPT-087",
    projectId: "VAL-2024-087",
    title: "Commercial Valuation Draft",
    inspectionNotes: "Commercial frontage and utility access confirmed.",
    valuationSummary: "Comparable sales indicate moderate upward adjustment.",
    recommendation: "Submit supporting calculations with report packet.",
    status: "Pending Review",
  },
];

export const simulatedOcrFields: OcrFields = {
  planNo: "SP/ENG/2026/0148",
  lotNo: "Lot 12B",
  ownerName: "Henderson Properties",
  propertyLocation: "Colombo 07",
  surveyDate: "2026-04-18",
};
