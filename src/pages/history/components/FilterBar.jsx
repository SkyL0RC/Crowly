import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterBar = ({ filters, onFilterChange }) => {
  const filterOptions = {
    type: [
      { value: 'all', label: 'All Types' },
      { value: 'send', label: 'Send' },
      { value: 'receive', label: 'Receive' },
      { value: 'swap', label: 'Swap' }
    ],
    network: [
      { value: 'all', label: 'All Networks' },
      { value: 'ethereum', label: 'Ethereum' },
      { value: 'tron', label: 'TRON' },
      { value: 'bitcoin', label: 'Bitcoin' },
      { value: 'solana', label: 'Solana' }
    ],
    status: [
      { value: 'all', label: 'All Status' },
      { value: 'completed', label: 'Completed' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' }
    ],
    dateRange: [
      { value: 'all', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'Last 7 Days' },
      { value: 'month', label: 'Last 30 Days' },
      { value: 'year', label: 'Last Year' }
    ]
  };

  return (
    <div className="card-elevated mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Filter" size={18} className="text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(filterOptions).map(([filterType, options]) => (
          <div key={filterType}>
            <label className="block text-xs font-medium text-muted-foreground mb-2 capitalize">
              {filterType.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <select
              value={filters[filterType]}
              onChange={(e) => onFilterChange(filterType, e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Active Filters */}
      {Object.values(filters).some(f => f !== 'all') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (value !== 'all') {
                return (
                  <button
                    key={key}
                    onClick={() => onFilterChange(key, 'all')}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-accent/10 border border-accent rounded-full text-xs font-medium text-accent hover:bg-accent hover:text-background transition-colors"
                  >
                    {value}
                    <Icon name="X" size={12} />
                  </button>
                );
              }
              return null;
            })}
            <button
              onClick={() => {
                Object.keys(filters).forEach(key => onFilterChange(key, 'all'));
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
