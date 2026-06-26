export type TechnicalOfficerReportStatus =
  | "Draft"
  | "Pending Review"
  | "Rejected"
  | "Clarification Requested"
  | "Resubmitted"
  | "Approved"
  | string;

export interface TechnicalOfficerReport {
  id: string;
  projectId: string;
  reportTitle: string;
  inspectionNotes: string;
  valuationSummary: string;
  recommendation: string;
  status: TechnicalOfficerReportStatus;
  rejectionReason: string | null;
  clarificationRequest: string | null;
  clarificationResponse: string | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTechnicalOfficerReportPayload {
  projectId: string;
  reportTitle: string;
  inspectionNotes: string;
  valuationSummary: string;
  recommendation: string;
}

export type UpdateTechnicalOfficerReportPayload = Partial<CreateTechnicalOfficerReportPayload> & {
  status?: string;
  rejectionReason?: string;
  clarificationRequest?: string;
  clarificationResponse?: string;
};

const API_BASE_URL = "http://localhost:3000/technical-officer/reports";

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  // Note: shared API error handling for Technical Officer report requests.
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const technicalOfficerReportsApi = {
  findAll: () => request<TechnicalOfficerReport[]>(API_BASE_URL),

  findByProject: (projectId: string) =>
    request<TechnicalOfficerReport[]>(`${API_BASE_URL}/project/${projectId}`),

  create: (payload: CreateTechnicalOfficerReportPayload) =>
    request<TechnicalOfficerReport>(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateTechnicalOfficerReportPayload) =>
    request<TechnicalOfficerReport>(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  submit: (id: string) =>
    request<TechnicalOfficerReport>(`${API_BASE_URL}/${id}/submit`, {
      method: "PATCH",
    }),

  respondToClarification: (id: string, clarificationResponse: string) =>
    request<TechnicalOfficerReport>(`${API_BASE_URL}/${id}/clarification-response`, {
      method: "PATCH",
      body: JSON.stringify({ clarificationResponse }),
    }),
};
