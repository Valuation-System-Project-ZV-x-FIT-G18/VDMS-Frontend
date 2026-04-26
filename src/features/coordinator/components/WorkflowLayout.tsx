import React from 'react';
import WorkflowStepper from './WorkflowStepper';

interface WorkflowLayoutProps {
  children: React.ReactNode;
  activeStep: number;
  steps: Array<{ number: number; label: string; path: string }>;
}

const WorkflowLayout: React.FC<WorkflowLayoutProps> = ({ children, activeStep, steps }) => {
  return (
    <div className="workflow-container" style={containerStyle}>
      <WorkflowStepper steps={steps} activeStep={activeStep} />
      <div className="workflow-content">{children}</div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: '0 20px',
  maxWidth: '1200px',
  margin: '0 auto',
};

export default WorkflowLayout;