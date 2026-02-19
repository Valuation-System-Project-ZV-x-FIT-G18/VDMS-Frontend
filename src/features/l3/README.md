# L3 Manager Dashboard

The L3 Manager Dashboard is a comprehensive management interface for L3-level managers in the VDMS (Valuation Document Management System). It provides oversight of all ongoing projects, team management, approval workflows, and analytics.

## 📁 Project Structure

```
src/features/l3/
├── pages/
│   ├── Dashboard.tsx          # Main dashboard with overview stats
│   ├── AllProjects.tsx        # Comprehensive project list with filtering
│   ├── Approvals.tsx          # Project approval and review interface
│   └── Reports.tsx            # Analytics and performance reports
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   ├── mockData.ts            # Mock data for development
│   └── helpers.ts             # Utility functions
└── README.md                  # This file
```

## 🎯 Key Features

### 1. Dashboard Page (`Dashboard.tsx`)

Main overview page displaying:

- **KPI Cards**: Total Projects, Pending Reviews, Approved Projects, Total Revenue, Pending Approvals, Completion Rate
- **Pending Approvals Section**: Quick view of items requiring manager approval
- **Team Workload Section**: Real-time workload monitoring for technical officers and coordinators
- **Recent Projects Table**: Latest project submissions

### 2. All Projects Page (`AllProjects.tsx`)

Comprehensive project management interface featuring:

- **Status Filters**: View projects by status (All, Needs Review, In Progress, Completed)
- **Smart Search**: Filter by Project ID, Property Address, or Applicant Name
- **Statistics Cards**: Quick metrics for each status category
- **Projects Table**: Sortable and filterable project list
- **Reset Functionality**: One-click filter reset

### 3. Approvals Page (`Approvals.tsx`)

Project approval workflow with:

- **Pending Reviews Tab**: Items awaiting manager decision
- **Processed Tab**: History of approved/rejected submissions
- **Priority Indicators**: Visual priority levels (Low, Medium, High)
- **Approval Types**: Document Review, Report Approval, Payment Authorization
- **Quick Actions**: Approve/Reject buttons for efficient workflow
- **Status Tracking**: Visual feedback on approval decisions

### 4. Reports Page (`Reports.tsx`)

Analytics and insights dashboard including:

- **Key Performance Indicators**: 6 major metrics in visual cards
- **Project Completion Trend**: Visual trend analysis (chart placeholder)
- **Revenue by Month**: Financial analytics (chart placeholder)
- **Status Breakdown**: Detailed project status distribution
- **Team Performance**: Individual team member metrics including:
  - Active projects
  - Completed projects
  - Completion rates

## 📊 Data Types

### Project

```typescript
interface Project {
  id: string;
  projectId: string;
  propertyAddress: string;
  applicant?: string;
  status: ProjectStatus;
  requestedDate: string;
  expectedCompletion: string;
  paymentStatus: PaymentStatus;
  technicalOfficer?: string;
  coordinator?: string;
}
```

### DashboardStats

```typescript
interface DashboardStats {
  totalProjects: number;
  reviewPending: number;
  approvedProjects: number;
  rejectedProjects: number;
  totalRevenue: number;
  pendingApprovals: number;
  completionRate: number;
}
```

### TeamMember

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: "technical_officer" | "coordinator";
  activeProjects: number;
  completedProjects: number;
  workload: "Low" | "Medium" | "High";
}
```

### ApprovalItem

```typescript
interface ApprovalItem {
  projectId: string;
  propertyAddress: string;
  submittedBy: string;
  submittedDate: string;
  priority: "Low" | "Medium" | "High";
  approvalType: "Document Review" | "Report Approval" | "Payment Authorization";
}
```

## 🛠 Utility Functions

### Formatting Functions

- `formatDate(dateString)`: Convert dates to readable format
- `formatCurrency(amount)`: Format numbers as currency
- `formatNumber(num)`: Format large numbers with commas

### Status & Color Functions

- `getStatusColor(status)`: Returns color code for project status
- `getPriorityColor(priority)`: Returns color code for priority level
- `getWorkloadColor(workload)`: Returns color code for workload level
- `calculateWorkloadPercentage(workload)`: Returns percentage for progress bar
- `getApprovalTypeIcon(type)`: Returns emoji icon for approval type

## 🎨 Styling

The dashboard uses:

- **Theme System**: Centralized color management through `theme.ts`
- **CSS-in-JS**: Inline styles with TypeScript `CSSProperties`
- **Ant Design Icons**: Professional icon set for UI elements
- **Responsive Grid Layouts**: Auto-fitting grid for responsive design

## 📦 Mock Data

The following mock data sets are available:

### `dashboardStats`

Summary statistics for the dashboard overview

### `mockProjects`

8 sample projects with various statuses

### `teamMembers`

8 team members (5 technical officers, 3 coordinators) with workload data

### `pendingApprovals`

6 pending approval items with different priority levels

## 🚀 Integration Guidelines

### Adding Routes

To integrate with your router, add these routes:

```typescript
import L3Dashboard from './features/l3/pages/Dashboard';
import L3AllProjects from './features/l3/pages/AllProjects';
import L3Approvals from './features/l3/pages/Approvals';
import L3Reports from './features/l3/pages/Reports';

// In your router configuration:
{
  path: '/l3',
  children: [
    { path: 'dashboard', element: <L3Dashboard /> },
    { path: 'projects', element: <L3AllProjects /> },
    { path: 'approvals', element: <L3Approvals /> },
    { path: 'reports', element: <L3Reports /> },
  ]
}
```

### Using Components

All components are built with React and TypeScript, using:

- Reusable components from `src/components/`
- Shared types and utilities
- Ant Design Icons for consistency

## 🔄 Next Steps

To make this production-ready:

1. **Add Real API Integration**: Replace mock data with API calls
2. **Implement Authentication**: Add role-based access control
3. **Add Charts**: Integrate a charting library (e.g., Recharts, Chart.js) for Reports page
4. **Export Functionality**: Implement actual report export to PDF/Excel
5. **Pagination**: Add proper pagination for large datasets
6. **Search Optimization**: Add backend search and filtering
7. **Real-time Updates**: Implement WebSocket for live data updates
8. **Notification System**: Add toast/notification toasts for approvals
9. **User Preferences**: Save filter preferences and layout customizations
10. **Accessibility**: Add ARIA labels and keyboard navigation

## 📝 Component Dependencies

- `StatCard`: Display KPI cards (from `src/components/atoms/`)
- `ProjectsTable`: Display project listings (from `src/components/organisms/`)
- `StatusBadge`: Display status indicators (from `src/components/atoms/`)
- `PaymentStatus`: Display payment indicators (from `src/components/atoms/`)
- Theme utilities from `src/styles/theme.ts`

## 🎓 Feature Highlights

✅ **Manager-centric Design**: Built specifically for L3 manager workflows
✅ **Real-time Metrics**: Dashboard updates with current project statistics
✅ **Team Management**: Monitor team workload and productivity
✅ **Approval Workflow**: Streamlined approval process with priority handling
✅ **Analytics**: Comprehensive reports and performance metrics
✅ **Responsive Design**: Works seamlessly on different screen sizes
✅ **Type-Safe**: Full TypeScript support for reliability
✅ **Extensible**: Easy to add new features and pages

## 📞 Support

For questions or issues related to the L3 Manager Dashboard, refer to the main project documentation or contact the development team.
