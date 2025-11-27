import React from 'react';
import { Button } from './ui/Button';

interface DateNavigatorProps {
  currentDate: string;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({ currentDate, onPrev, onNext, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Button variant="ghost" size="icon" onClick={onPrev} className="rounded-full">
        <span className="material-icons-outlined">chevron_left</span>
      </Button>
      <h2 className="text-lg font-semibold text-center mx-4 min-w-[140px] text-text-light-primary dark:text-text-dark-primary">
        {currentDate}
      </h2>
      <Button variant="ghost" size="icon" onClick={onNext} className="rounded-full">
        <span className="material-icons-outlined">chevron_right</span>
      </Button>
    </div>
  );
};
