import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportButton = ({ onClick, disabled }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      className="flex items-center gap-2 whitespace-nowrap"
    >
      <Icon name="Download" size={18} />
      Export CSV
    </Button>
  );
};

export default ExportButton;
