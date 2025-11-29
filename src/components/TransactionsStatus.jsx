import React from 'react';
import Icon from './AppIcon';

const TransactionStatus = ({ 
  status = 'pending',
  showIcon = true,
  className = ''
}) => {
  const statusConfig = {
    success: {
      label: 'Completed',
      icon: 'CheckCircle2',
      className: 'transaction-status success'
    },
    pending: {
      label: 'Pending',
      icon: 'Clock',
      className: 'transaction-status pending'
    },
    failed: {
      label: 'Failed',
      icon: 'XCircle',
      className: 'transaction-status failed'
    },
    processing: {
      label: 'Processing',
      icon: 'Loader2',
      className: 'transaction-status pending'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.pending;

  return (
    <span className={`${config?.className} ${className}`}>
      {showIcon && (
        <Icon 
          name={config?.icon} 
          size={14} 
          className={status === 'processing' ? 'animate-spin' : ''}
        />
      )}
      <span>{config?.label}</span>
    </span>
  );
};

export default TransactionStatus;