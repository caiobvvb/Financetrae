import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: 'home', path: '/', label: 'Dashboard' },
    { icon: 'event', path: '/calendar', label: 'Calendário' }, // Novo item
    { icon: 'swap_horiz', path: '/transactions', label: 'Transações' },
    { icon: 'account_balance', path: '/accounts', label: 'Contas' },
    { icon: 'credit_card', path: '/credit-cards', label: 'Cartões' },
    { icon: 'bar_chart', path: '/reports', label: 'Relatórios' },
    { icon: 'label', path: '/categories', label: 'Categorias' },
    { icon: 'receipt_long', path: '/budgets', label: 'Orçamentos' },
  ];

  return (
    <aside className="w-20 bg-surface-light dark:bg-surface-dark flex flex-col items-center py-6 shadow-md z-20 h-full border-r border-gray-100 dark:border-gray-800">
      <div className="mb-8 p-2">
        <svg fill="none" height="40" viewBox="0 0 40 40" width="40" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 35V5C10 4.44772 10.4477 4 11 4H15C15.5523 4 16 4.44772 16 5V35C16 35.5523 15.5523 36 15 36H11C10.4477 36 10 35.5523 10 35Z" fill="#A78BFA"></path>
          <path d="M24 35V5C24 4.44772 24.4477 4 25 4H29C29.5523 4 30 4.44772 30 5V35C30 35.5523 29.5523 36 29 36H25C24.4477 36 24 35.5523 24 35Z" fill="#6D28D9"></path>
        </svg>
      </div>

      <nav className="flex flex-col items-center space-y-3 flex-grow w-full px-2">
        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover transition-colors mb-4">
          <span className="material-icons-outlined">add</span>
        </button>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `p-3 rounded-lg transition-colors flex items-center justify-center w-12 h-12 ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/30 dark:text-white'
                  : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
            title={item.label}
          >
            <span className="material-icons-outlined text-2xl">{item.icon}</span>
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col items-center space-y-3 px-2">
        <button className="p-3 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="material-icons-outlined">settings</span>
        </button>
        <button className="p-3 rounded-lg text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span className="material-icons-outlined">help_outline</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;