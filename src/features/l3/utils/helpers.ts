// Helper functions for L3 Manager features

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

export const calculateWorkloadPercentage = (
  workload: 'Low' | 'Medium' | 'High'
): number => {
  const workloadMap = {
    Low: 30,
    Medium: 65,
    High: 90,
  };
  return workloadMap[workload];
};

export const getWorkloadColor = (
  workload: 'Low' | 'Medium' | 'High'
): string => {
  const colorMap = {
    Low: '#52c41a', // Green
    Medium: '#faad14', // Orange
    High: '#f5222d', // Red
  };
  return colorMap[workload];
};

export const getPriorityColor = (priority: 'Low' | 'Medium' | 'High'): string => {
  const colorMap = {
    Low: '#52c41a', // Green
    Medium: '#faad14', // Orange
    High: '#f5222d', // Red
  };
  return colorMap[priority];
};

export const getStatusColor = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'Completed': '#52c41a',
    'In Progress': '#1890ff',
    'Needs Review': '#faad14',
    'Payment Pending': '#d4380d',
    'Report Prepared': '#722ed1',
    'Awaiting Docs': '#13c2c2',
    'Site Inspected': '#1890ff',
    'Rejected': '#f5222d',
  };
  return statusMap[status] || '#8c8c8c';
};

export const getApprovalTypeIcon = (type: string): string => {
  const iconMap: { [key: string]: string } = {
    'Document Review': '📄',
    'Report Approval': '✓',
    'Payment Authorization': '💳',
  };
  return iconMap[type] || '📋';
};
