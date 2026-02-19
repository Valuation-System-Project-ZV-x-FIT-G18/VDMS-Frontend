import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Step {
  number: number;
  label: string;
  path: string;
}

interface WorkflowStepperProps {
  steps: Step[];
  activeStep: number;
}

const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ steps, activeStep }) => {
  const navigate = useNavigate();

  const handleStepClick = (stepNumber: number, path: string) => {
    if (stepNumber <= activeStep) {
      navigate(path);
    }
  };

  return (
    <div className="stepper" style={stepperStyle}>
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step ${step.number === activeStep ? 'step--active' : ''} ${step.number < activeStep ? 'step--completed' : ''}`}
          data-step={step.number}
          onClick={() => handleStepClick(step.number, step.path)}
          style={{ 
            cursor: step.number <= activeStep ? 'pointer' : 'default',
            ...stepItemStyle 
          }}
        >
          <div className="step__dot" style={dotStyle(step.number, activeStep)}>
            {step.number}
          </div>
          <div className="step__label" style={labelStyle(step.number, activeStep)}>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Inline styles (or you can import from your original App.css)
const stepperStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '780px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  margin: '6px 0 24px',
  flexWrap: 'wrap',
  gap: '8px 0',
};

const stepItemStyle: React.CSSProperties = {
  position: 'relative',
  flex: '1 1 0',
  minWidth: '60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
};

const dotStyle = (stepNumber: number, activeStep: number): React.CSSProperties => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'grid',
  placeItems: 'center',
  fontSize: '12px',
  fontWeight: 700,
  backgroundColor: stepNumber === activeStep ? '#0b5be6' : stepNumber < activeStep ? '#52c41a' : '#fff',
  border: `1px solid ${stepNumber === activeStep ? '#0b5be6' : '#dfe7f3'}`,
  color: stepNumber <= activeStep ? '#fff' : '#9aa6b2',
});

const labelStyle = (stepNumber: number, activeStep: number): React.CSSProperties => ({
  fontSize: '11px',
  color: stepNumber === activeStep ? '#0b5be6' : '#9aa6b2',
  fontWeight: stepNumber === activeStep ? 600 : 400,
  whiteSpace: 'nowrap',
});

export default WorkflowStepper;