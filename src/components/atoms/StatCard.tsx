import type { CSSProperties, ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  iconBgColor?: string;
}

const StatCard = ({ title, value, icon, iconBgColor = '#1890ff' }: StatCardProps) => {
  const cardStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '20px 24px',
    borderRadius: '20px',
    border: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '200px',
  };

  const contentStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const titleStyle: CSSProperties = {
    fontSize: '14px',
    color: '#8c8c8c',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const valueStyle: CSSProperties = {
    fontSize: '30px',
    fontWeight: 700,
    color: '#262626',
  };

  const iconContainerStyle: CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: iconBgColor + '20', // 20% opacity
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: iconBgColor,
    fontSize: '24px',
  };

  return (
    <div style={cardStyle}>
      <div style={contentStyle}>
        <span style={titleStyle}>{title}</span>
        <span style={valueStyle}>{value}</span>
      </div>
      <div style={iconContainerStyle}>{icon}</div>
    </div>
  );
};

export default StatCard;