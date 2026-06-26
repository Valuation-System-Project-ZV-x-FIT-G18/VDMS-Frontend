import React from 'react';
import FleetButton from './FleetButton';
import '../styles/button-grid.css';

interface ButtonConfig {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface ButtonGridProps {
  buttons: ButtonConfig[];
  onButtonClick: (id: string) => void;
}

const ButtonGrid: React.FC<ButtonGridProps> = ({ buttons, onButtonClick }) => (
  <div className="button-grid">
    {buttons.map((btn) => (
      <FleetButton
        key={btn.id}
        label={btn.label}
        icon={btn.icon}
        description={btn.description}
        onClick={() => onButtonClick(btn.id)}
      />
    ))}
  </div>
);

export default ButtonGrid;