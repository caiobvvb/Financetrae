import React from 'react';
import { Button } from './ui/Button';

interface FilterOption {
  label: string;
  value: string;
  icon?: string;
}

interface FilterPillsProps {
  filters: (string | FilterOption)[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  variant?: 'solid' | 'outline';
}

export const FilterPills: React.FC<FilterPillsProps> = ({ 
  filters, 
  activeFilter, 
  onFilterChange,
  variant = 'outline' 
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter, index) => {
        const label = typeof filter === 'string' ? filter : filter.label;
        const value = typeof filter === 'string' ? filter : filter.value;
        const icon = typeof filter === 'object' ? filter.icon : undefined;
        const isActive = activeFilter === value;

        if (variant === 'solid') {
             return (
                <button 
                    key={index}
                    onClick={() => onFilterChange && onFilterChange(value)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                        isActive 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    {label}
                </button>
             )
        }

        return (
          <Button
            key={index}
            variant="outline"
            className={`rounded-lg shadow-sm border-border-light dark:border-border-dark ${isActive ? 'bg-gray-100 dark:bg-gray-700' : 'bg-surface-light dark:bg-surface-dark'}`}
            onClick={() => onFilterChange && onFilterChange(value)}
          >
            {icon && <span className="material-icons-outlined text-lg mr-2">{icon}</span>}
            <span>{label}</span>
            <span className="material-icons-outlined text-lg text-text-light-secondary dark:text-text-dark-secondary ml-1">expand_more</span>
          </Button>
        );
      })}
    </div>
  );
};
