import api from './api';
import { portalDefaults, type PortalRole } from '../config/portalConfig';

export interface AccountSettingsRecord {
  id: string;
  role: 'bank_credit_officer' | 'property_owner';
  accountId: string;
  bankName: string | null;
  branch: string | null;
  contactPersonName: string | null;
  fullName: string | null;
  nationalId: string | null;
  residentialAddress: string | null;
  email: string;
  phone: string | null;
  emailNotifications: boolean;
  smsAlerts: boolean;
  lastPasswordChangeAt: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
}

export interface AccountSettingsUpdatePayload {
  bankName?: string | null;
  branch?: string | null;
  contactPersonName?: string | null;
  fullName?: string | null;
  nationalId?: string | null;
  residentialAddress?: string | null;
  email?: string;
  phone?: string | null;
  emailNotifications?: boolean;
  smsAlerts?: boolean;
  lastPasswordChangeAt?: string | null;
  lastLoginAt?: string | null;
  lastLoginIp?: string | null;
}

const roleMap: Record<PortalRole, AccountSettingsRecord['role']> = {
  bank: 'bank_credit_officer',
  owner: 'property_owner',
};

const accountIdMap: Record<PortalRole, string> = {
  bank: portalDefaults.bank.accountId,
  owner: portalDefaults.owner.accountId,
};

/**
 * Normalizes role-to-endpoint context so calling pages do not duplicate account routing logic.
 */
export const resolveAccountSettingsContext = (role: PortalRole) => ({
  role: roleMap[role],
  accountId: accountIdMap[role],
});

/**
 * Reads persisted account settings using role-aware path resolution.
 */
export async function getAccountSettings(role: PortalRole) {
  const context = resolveAccountSettingsContext(role);
  const response = await api.get<AccountSettingsRecord>(
    `/account-settings/${context.role}/${context.accountId}`,
  );

  return response.data;
}

/**
 * Saves validated account settings fields through the same role-aware endpoint contract.
 */
export async function saveAccountSettings(
  role: PortalRole,
  payload: AccountSettingsUpdatePayload,
) {
  const context = resolveAccountSettingsContext(role);
  const response = await api.put<AccountSettingsRecord>(
    `/account-settings/${context.role}/${context.accountId}`,
    payload,
  );

  return response.data;
}