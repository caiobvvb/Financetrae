import React from 'react';
import { Card } from './ui/Card';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  iconColor?: string;
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
  layout?: 'horizontal' | 'vertical' | 'simple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon, 
  iconColor = "text-primary", 
  iconBg = "bg-primary/10",
  layout = 'horizontal',
  onClick
}) => {
  if (layout === 'simple') {
    return (
       <Card onClick={onClick} className={`p-5 flex justify-between items-center ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
        <div>
          <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-1">{label}</p>
          <p className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center ${iconColor} shadow-sm`}>
          <span className="material-icons-outlined">{icon}</span>
        </div>
      </Card>
    )
  }

  // Vertical layout (used in Transactions sidebar mostly)
  if (layout === 'vertical') {
    return (
      <Card onClick={onClick} className={`p-4 flex items-center justify-between ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
        <div>
           <div className="flex items-center gap-1 mb-1">
             <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{label}</p>
             {onClick && <span className="material-icons-outlined text-sm text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>}
           </div>
          <p className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">{value}</p>
        </div>
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBg} ${iconColor}`}>
          <span className="material-icons-outlined">{icon}</span>
        </div>
      </Card>
    );
  }

  // Horizontal/Dashboard layout
  return (
    <Card onClick={onClick} className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-1">
            <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{label}</span>
            {onClick && <span className="material-icons-outlined text-sm text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>}
        </div>
        <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
          <span className="material-icons-outlined">{icon}</span>
        </div>
      </div>
      <p className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary">{value}</p>
    </Card>
  );
};
