export const COORDINATOR_STORAGE_KEYS = {
  activeClientNic: 'active-client-nic',
  registerClient: 'register-client',
  registerBank: 'register-bank',
  propertyInfo: 'property-info',
  surveyPlan: 'survey-plan',
  legalDetails: 'legal-details',
  searchMode: 'search-mode',
  searchQuery: 'search-query',
} as const;

export const COORDINATOR_RESET_EVENT = 'coordinator:reset-after-register-success';

const parseJson = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const setActiveClientNic = (nic: string) => {
  const trimmed = nic.trim();
  if (!trimmed) return;
  localStorage.setItem(COORDINATOR_STORAGE_KEYS.activeClientNic, trimmed);
};

export const getActiveClientNic = (): string => {
  const direct = (localStorage.getItem(COORDINATOR_STORAGE_KEYS.activeClientNic) ?? '').trim();
  if (direct) return direct;

  const parsed = parseJson<{ nic?: string; NIC?: string }>(localStorage.getItem(COORDINATOR_STORAGE_KEYS.registerClient));
  return (parsed?.nic ?? parsed?.NIC ?? '').trim();
};

export const clearCoordinatorDraftsAndSearch = () => {
  const keysToClear = [
    COORDINATOR_STORAGE_KEYS.registerClient,
    COORDINATOR_STORAGE_KEYS.registerBank,
    COORDINATOR_STORAGE_KEYS.propertyInfo,
    COORDINATOR_STORAGE_KEYS.surveyPlan,
    COORDINATOR_STORAGE_KEYS.legalDetails,
    COORDINATOR_STORAGE_KEYS.searchMode,
    COORDINATOR_STORAGE_KEYS.searchQuery,
  ];

  keysToClear.forEach((key) => localStorage.removeItem(key));
  window.dispatchEvent(new CustomEvent(COORDINATOR_RESET_EVENT));
};

export const resetCoordinatorStateAfterRegisterSuccess = (nic: string) => {
  setActiveClientNic(nic);
  clearCoordinatorDraftsAndSearch();
};
