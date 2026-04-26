export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};

export const calculateWorkloadPercentage = (workload: string): number => {
  const workloadMap: Record<string, number> = {
    Low: 30,
    Medium: 65,
    High: 90,
  };
  return workloadMap[workload] || 0;
};

export const getWorkloadColor = (workload: string): string => {
  const colorMap: Record<string, string> = {
    Low: "#52c41a",
    Medium: "#faad14",
    High: "#f5222d",
  };
  return colorMap[workload] || "#8c8c8c";
};

export const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    Low: "#52c41a",
    Medium: "#faad14",
    High: "#f5222d",
  };
  return colorMap[priority] || "#8c8c8c";
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    Completed: "#52c41a",
    "In Progress": "#1890ff",
    "Needs Review": "#faad14",
    "Payment Pending": "#a4161a",
    Rejected: "#ff4d4f",
    "Report Prepared": "#13c2c2",
  };
  return colorMap[status] || "#8c8c8c";
};

export const getApprovalTypeIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    "Report Approval": "✓",
    "Document Review": "📄",
    "Payment Authorization": "💰",
  };
  return iconMap[type] || "•";
};
