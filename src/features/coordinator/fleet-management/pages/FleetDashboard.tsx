import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonGrid from '../components/ButtonGrid';
import '../styles/fleet-dashboard.css';

const FleetDashboard: React.FC = () => {
  const navigate = useNavigate();

  const buttons = [
    { id: 'assigned', label: 'Assigned TO', icon: '✓', description: 'View assigned technical officers' },
    { id: 'available', label: 'Available TO', icon: '✨', description: 'View free technical officers' },
    { id: 'all', label: 'All TO', icon: '👥', description: 'View all technical officers' },
    { id: 'rejected', label: 'Rejected TO', icon: '✗', description: 'View rejected officers' },
  ];

  const handleButtonClick = (id: string) => {
    const routes: { [key: string]: string } = {
      assigned: '/coordinator/assigned-to',
      available: '/coordinator/available-to',
      all: '/coordinator/all-to',
      rejected: '/coordinator/rejected-to',
    };
    navigate(routes[id]);
  };

  return (
    <div className="fleet-dashboard">
      <div className="fleet-hero">
        <h1>Fleet Management</h1>
        <p className="subtitle">Select a category to view technical officers</p>
        <div className="fleet-title-bar" />
      </div>
      <ButtonGrid buttons={buttons} onButtonClick={handleButtonClick} />
    </div>
  );
};

export default FleetDashboard;