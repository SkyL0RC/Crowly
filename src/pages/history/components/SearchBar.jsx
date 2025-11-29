import React from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="flex-1 relative">
      <Icon 
        name="Search" 
        size={18} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by hash, address, or token..."
        className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="X" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
