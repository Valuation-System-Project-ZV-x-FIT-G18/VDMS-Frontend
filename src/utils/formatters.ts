/**
 * Uses a single currency format path to keep amount rendering consistent across pages.
 */
export const formatAmountLkr = (amount: string | number): string => {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  const safeValue = Number.isFinite(value) ? value : 0;

  return safeValue.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

/**
 * Normalizes date display so all invoice and project screens use the same short format.
 */
export const formatDateShort = (dateValue: string): string => {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

/**
 * Creates human-readable relative timestamps for notifications and activity indicators.
 */
export const formatRelativeTime = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();

  if (Number.isNaN(created.getTime())) {
    return 'Unknown time';
  }

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }

  return `${diffDays} days ago`;
};

/**
 * Encapsulates due-date math so screens avoid duplicated date arithmetic logic.
 */
export const getDaysRemaining = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};