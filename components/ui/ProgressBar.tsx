import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  colorClass?: string;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  colorClass = "bg-primary", 
  heightClass = "h-2.5" 
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClass}`}>
      <div 
        className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};
