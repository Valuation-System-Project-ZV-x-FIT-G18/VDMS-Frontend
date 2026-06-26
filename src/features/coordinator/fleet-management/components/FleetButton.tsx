import React from 'react';
import '../styles/fleet-button.css';

interface FleetButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  description: string;
}

const FleetButton: React.FC<FleetButtonProps> = ({ label, icon, onClick, description }) => (
  <button className="fleet-button" onClick={onClick} title={description}>
    <div className="fleet-button-icon">{icon}</div>
    <div className="fleet-button-label">{label}</div>
  </button>
);

export default FleetButton;