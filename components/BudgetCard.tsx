import React from 'react';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface BudgetCardProps {
  category: string;
  icon: string;
  iconBg?: string;
  period: string;
  spent: number;
  limit: number;
  color?: string; // Tailwind text color class e.g., 'text-green-600'
  barColor?: string; // Tailwind bg color class e.g., 'bg-green-500'
  warning?: boolean;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  category,
  icon,
  iconBg = "bg-gray-100 dark:bg-gray-800",
  period,
  spent,
  limit,
  color = "text-text-light-primary",
  barColor = "bg-primary",
  warning = false
}) => {
  const remaining = limit - spent;
  const isExceeded = remaining < 0;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center text-2xl`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-text-light-primary dark:text-text-dark-primary">{category}</h3>
            <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wide">{period}</p>
          </div>
        </div>
        <button className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary transition-colors">
          <span className="material-icons-outlined">more_vert</span>
        </button>
      </div>
      
      <div className="flex justify-between items-baseline mb-3">
        <span className={`text-2xl font-bold ${color}`}>
          R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary font-medium">
          / R$ {limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="mb-3">
        <ProgressBar value={spent} max={limit} colorClass={barColor} heightClass="h-3" />
      </div>
      
      {!warning ? (
        <p className={`text-sm font-medium ${color.replace('600', '700').replace('400', '300')}`}>
            {isExceeded 
                ? `Excedido em R$ ${Math.abs(remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                : `Restam R$ ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} para este período.`
            }
        </p>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg flex items-center text-sm border border-red-100 dark:border-red-900">
          <span className="material-icons-outlined mr-2 text-base">warning_amber</span>
          Orçamento excedido em R$ {Math.abs(remaining).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      )}
    </Card>
  );
};
