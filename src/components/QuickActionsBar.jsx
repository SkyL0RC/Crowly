import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './AppIcon';

const QuickActionsBar = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'send',
      label: 'Send',
      icon: 'Send',
      path: '/send-transfer',
      description: 'Transfer assets'
    },
    {
      id: 'receive',
      label: 'Receive',
      icon: 'Download',
      path: '/receive',
      description: 'Get wallet address'
    },
    {
      id: 'swap',
      label: 'Swap',
      icon: 'ArrowLeftRight',
      path: '/swap',
      description: 'Exchange tokens'
    },
    {
      id: 'history',
      label: 'History',
      icon: 'History',
      path: '/history',
      description: 'View transactions'
    }
  ];

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="quick-actions">
      {quickActions?.map((action) => (
        <button
          key={action?.id}
          className="quick-action-button group"
          onClick={() => handleActionClick(action?.path)}
          title={action?.description}
        >
          <Icon 
            name={action?.icon} 
            size={20} 
            className="transition-transform duration-150 group-hover:scale-110"
          />
          <span>{action?.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsBar;