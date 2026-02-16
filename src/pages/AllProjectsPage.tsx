import { useState } from 'react';
import type { CSSProperties } from 'react';
import ProjectsTable from '../components/organisms/ProjectsTable';
import { mockProjects } from '../utils/mockData';
import { theme } from '../styles/theme';

const AllProjectsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [dateFormat, setDateFormat] = useState<string>('mm/dd/yy');

  // Filter projects based on selected filters
  const filteredProjects = mockProjects.filter((project) => {
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || project.paymentStatus === paymentFilter;
    return matchesStatus && matchesPayment;
  });

  const containerStyle: CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle: CSSProperties = {
    marginBottom: '24px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '28px',
    fontWeight: 700,
    color: theme.colors.text.primary,
    marginBottom: '8px',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: '14px',
    color: theme.colors.text.secondary,
  };

  const filtersContainerStyle: CSSProperties = {
    backgroundColor: theme.colors.background.paper,
    padding: '20px 24px',
    borderRadius: '8px',
    marginBottom: '24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  };

  const searchWrapperStyle: CSSProperties = {
    flex: 1,
    position: 'relative',
  };

  const searchInputStyle: CSSProperties = {
    width: '100%',
    padding: '8px 16px 8px 36px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%238c8c8c\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cpath d=\'m21 21-4.35-4.35\'%3E%3C/path%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '12px center',
  };

  const selectStyle: CSSProperties = {
    padding: '8px 32px 8px 12px',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: theme.colors.background.paper,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    minWidth: '150px',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Valuation Jobs</h1>
        <p style={subtitleStyle}>Manage and track your property valuation requests</p>
      </div>

      {/* Filters */}
      <div style={filtersContainerStyle}>
        {/* Search */}
        <div style={searchWrapperStyle}>
          <input
            type="text"
            placeholder="search by project id or location"
            style={searchInputStyle}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">status: All</option>
          <option value="Site Inspected">Site Inspected</option>
          <option value="Awaiting Docs">Awaiting Docs</option>
          <option value="Completed">Completed</option>
          <option value="Payment Pending">Payment Pending</option>
          <option value="Report Prepared">Report Prepared</option>
          <option value="In Progress">In Progress</option>
        </select>

        {/* Payment Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="All">Payment: All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Date Format Selector */}
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          style={selectStyle}
        >
          <option value="mm/dd/yy">mm/dd/yy</option>
          <option value="dd/mm/yy">dd/mm/yy</option>
          <option value="yyyy-mm-dd">yyyy-mm-dd</option>
        </select>
      </div>

      {/* Projects Table */}
      <ProjectsTable projects={filteredProjects} showSearch={false} />
    </div>
  );
};

export default AllProjectsPage;