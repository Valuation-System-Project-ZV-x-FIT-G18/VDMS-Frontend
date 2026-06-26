export type PortalRole = 'bank' | 'owner';

export const storageKeys = {
  currentUserId: 'currentUserId',
  currentUserName: 'currentUserName',
  ownerClientId: 'ownerClientId',
} as const;

export const portalDefaults = {
  bank: {
    clientId: 'client-001',
    accountId: 'client-001',
    userId: 'user-bank-001',
    userName: 'Bank Credit Officer',
  },
  owner: {
    clientId: 'client-001',
    accountId: 'owner-001',
    userId: 'user-owner-001',
    userName: 'Property Owner',
  },
} as const;

export const uiDefaults = {
  recentItemsLimit: 5,
  tablePageSize: 5,
  chatPollIntervalMs: 5000,
  notificationPreviewLimit: 5,
  passwordMinLength: 8,
} as const;

export const projectDetailDefaults = {
  clientDisplayName: 'Valuation Client',
  propertyType: 'Residential Property',
  valuationType: 'Market Valuation',
  bankBranch: 'Main Branch',
  applicantContact: 'Not available',
} as const;

/**
 * Centralizes client-id resolution so page components do not duplicate storage fallback logic.
 */
export const getPortalClientId = (role: PortalRole): string => {
  if (role === 'owner') {
    return localStorage.getItem(storageKeys.ownerClientId) || portalDefaults.owner.clientId;
  }

  return portalDefaults.bank.clientId;
};

/**
 * Keeps user-id fallback behavior consistent for notifications and messaging surfaces.
 */
export const getCurrentUserId = (role: PortalRole): string => {
  return localStorage.getItem(storageKeys.currentUserId) || portalDefaults[role].userId;
};

/**
 * Provides a stable display name when auth profile data is not yet available.
 */
export const getCurrentUserName = (role: PortalRole): string => {
  return localStorage.getItem(storageKeys.currentUserName) || portalDefaults[role].userName;
};