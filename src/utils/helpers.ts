// Helper utility functions

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Completed': '#52c41a',
    'Site Inspected': '#1890ff',
    'Awaiting Docs': '#faad14',
    'Payment Pending': '#ff4d4f',
    'Report Prepared': '#fadb14',
    'In Progress': '#1890ff',
  };
  return statusMap[status] || '#8c8c8c';
};

export const getStatusBgColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Completed': '#f6ffed',
    'Site Inspected': '#e6f4ff',
    'Awaiting Docs': '#fffbe6',
    'Payment Pending': '#fff1f0',
    'Report Prepared': '#feffe6',
    'In Progress': '#e6f4ff',
  };
  return statusMap[status] || '#f5f5f5';
};

export const getPaymentStatusColor = (status: string): string => {
  return status === 'Paid' ? '#52c41a' : '#faad14';
};