import React from 'react';

interface CategoryItemProps {
  name: string;
  icon: string;
  subtitle?: string;
  colors: {
    icon: string;
    bg: string;
    wrapper: string;
  };
  hasDragHandle?: boolean;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ name, icon, subtitle, colors, hasDragHandle = true }) => {
  return (
    <div className={`${colors.wrapper} p-3 rounded-lg flex items-center justify-between hover:opacity-90 transition-opacity cursor-pointer group`}>
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
          <span className={`material-icons ${colors.icon}`}>{icon}</span>
        </div>
        <div>
          <p className="font-medium text-text-light-primary dark:text-text-dark-primary">{name}</p>
          {subtitle && <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">{subtitle}</span>}
        </div>
      </div>
      {hasDragHandle && (
        <div className="flex items-center space-x-2 text-text-light-secondary dark:text-text-dark-secondary opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full">
            <span className="material-icons text-xl">drag_indicator</span>
          </button>
        </div>
      )}
    </div>
  );
};
