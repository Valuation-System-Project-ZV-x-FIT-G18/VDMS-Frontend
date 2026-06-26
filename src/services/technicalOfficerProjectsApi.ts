export type TechnicalOfficerProjectStatus =
  | "Assigned"
  | "In Progress"
  | "Site Inspection"
  | "Document Upload"
  | "OCR Review"
  | "Report Submission"
  | "Pending Review"
  | "Completed"
  | "Overdue";

export interface TechnicalOfficerProject {
  id: string;
  projectCode: string;
  clientName: string;
  location: string;
  deadline: string;
  status: TechnicalOfficerProjectStatus;
  progress: number;
  assignedOfficerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTechnicalOfficerProjectPayload {
  projectCode: string;
  clientName: string;
  location: string;
  deadline: string;
  status?: TechnicalOfficerProjectStatus;
  progress?: number;
  assignedOfficerName: string;
}

export type UpdateTechnicalOfficerProjectPayload = Partial<CreateTechnicalOfficerProjectPayload>;

const API_BASE_URL = "http://localhost:3000/technical-officer/projects";

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  // Note: shared API error handling for Technical Officer project requests.
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

export const technicalOfficerProjectsApi = {
  findAll: () => request<TechnicalOfficerProject[]>(API_BASE_URL),

  findOne: (id: string) => request<TechnicalOfficerProject>(`${API_BASE_URL}/${id}`),

  create: (payload: CreateTechnicalOfficerProjectPayload) =>
    request<TechnicalOfficerProject>(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateTechnicalOfficerProjectPayload) =>
    request<TechnicalOfficerProject>(`${API_BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  remove: (id: string) =>
    request<{ message: string; id: string }>(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    }),
};
