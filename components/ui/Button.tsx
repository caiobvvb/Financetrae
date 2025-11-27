import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = "", 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-md border border-transparent",
    secondary: "bg-teal-500 text-white hover:bg-teal-600 shadow-md border border-transparent",
    outline: "bg-transparent border border-gray-300 dark:border-gray-600 text-text-light-primary dark:text-text-dark-primary hover:bg-gray-50 dark:hover:bg-gray-800",
    ghost: "bg-transparent text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800",
    icon: "bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm rounded-full"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "w-10 h-10 p-0"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
