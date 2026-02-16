import type { CSSProperties } from 'react';
import { getStatusColor, getStatusBgColor } from '../../utils/helpers';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const style: CSSProperties = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: getStatusColor(status),
    backgroundColor: getStatusBgColor(status),
  };

  return (
    <span style={style} className={className}>
      {status}
    </span>
  );
};

export default StatusBadge;