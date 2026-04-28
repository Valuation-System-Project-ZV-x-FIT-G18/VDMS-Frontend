type AppRole =
  | 'bank'
  | 'owner'
  | 'coordinator'
  | 'technical-officer'
  | 'l1-manager'
  | 'l2-manager'
  | 'l3-manager'
  | 'admin'
  | 'senior-valuator';

export interface ChatIdentity {
  id: string;
  name: string;
  role: AppRole | 'user';
}

const defaultIdByRole: Record<string, string> = {
  bank: 'user-bank-001',
  owner: 'user-owner-001',
  coordinator: 'user-coordinator-001',
  'technical-officer': 'user-technical-officer-001',
  'l1-manager': 'user-l1-manager-001',
  'l2-manager': 'user-l2-manager-001',
  'l3-manager': 'user-l3-manager-001',
  admin: 'user-admin-001',
  'senior-valuator': 'user-senior-valuator-001',
};

const defaultNameByRole: Record<string, string> = {
  bank: 'Bank Credit Officer',
  owner: 'Property Owner',
  coordinator: 'Coordinator',
  'technical-officer': 'Technical Officer',
  'l1-manager': 'L1 Manager',
  'l2-manager': 'L2 Manager',
  'l3-manager': 'L3 Manager',
  admin: 'Administrator',
  'senior-valuator': 'Senior Valuator',
};

export const resolveChatUserId = (role?: AppRole | string): string | undefined => {
  if (!role) {
    return undefined;
  }

  return defaultIdByRole[role] || undefined;
};

export const getChatIdentity = (role?: AppRole, preferredName?: string): ChatIdentity => {
  const storedId = localStorage.getItem('currentUserId');
  const storedName = localStorage.getItem('currentUserName');
  const storedRole = localStorage.getItem('currentUserRole');

  const resolvedRole = (role || storedRole || 'user') as AppRole | 'user';
  const fallbackId = role ? defaultIdByRole[role] : undefined;
  const fallbackName = role ? defaultNameByRole[role] : undefined;

  const hasExplicitRole = Boolean(role);

  // For role-specific portals, always bind chat identity to that role's canonical user.
  // This prevents stale localStorage ids from other roles causing incorrect unread/read behavior.
  const id = hasExplicitRole
    ? fallbackId || 'user-generic-001'
    : storedId || fallbackId || 'user-generic-001';

  const name = hasExplicitRole
    ? preferredName || fallbackName || storedName || 'User'
    : preferredName || storedName || fallbackName || 'User';

  localStorage.setItem('currentUserId', id);
  localStorage.setItem('currentUserName', name);
  localStorage.setItem('currentUserRole', resolvedRole);

  return { id, name, role: resolvedRole };
};
