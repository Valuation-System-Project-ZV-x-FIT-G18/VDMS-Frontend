import type { CSSProperties } from 'react';
import { getPaymentStatusColor } from '../../utils/helpers';

interface PaymentStatusProps {
  status: 'Paid' | 'Pending';
}

const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#595959',
  };

  const dotStyle: CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: getPaymentStatusColor(status),
  };

  return (
    <div style={style}>
      <span style={dotStyle}></span>
      {status}
    </div>
  );
};

export default PaymentStatus;