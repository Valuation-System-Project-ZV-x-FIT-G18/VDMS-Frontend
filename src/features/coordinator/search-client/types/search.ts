/* Shape of the search result returned by the backend API */
export interface SearchResult {
  found: boolean;       // whether a matching loan applicant was found
  name?: string;        // full name of the applicant
  nic?: string;         // NIC number
  email?: string;       // email address
  projectId?: string | null; // linked project ID (null if searched by NIC only)
}
