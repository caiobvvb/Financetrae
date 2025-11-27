import React from 'react';
import { useAuth } from '../contexts/AuthProvider';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showActions?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSearch, showActions }) => {
  const { user, signOut } = useAuth();
  return (
    <header className="flex items-center justify-between mb-8 pt-2">
      <div className="flex items-center gap-4">
        {title && (
            <h1 className="text-2xl md:text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">{title}</h1>
        )}
        {!title && (
             <button className="flex items-center gap-3 bg-primary text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-primary-hover transition-colors">
             <span className="material-icons-outlined">swap_horiz</span>
             Transações
           </button>
        )}
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {showSearch && (
          <>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <span className="material-icons-outlined text-text-light-secondary dark:text-text-dark-secondary">search</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <span className="material-icons-outlined text-text-light-secondary dark:text-text-dark-secondary">filter_list</span>
            </button>
          </>
        )}
         
         {!showSearch && (
            <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-lg border border-border-light dark:border-border-dark shadow-sm cursor-pointer">
                <div className="relative">
                    <img 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full border border-gray-200" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo0v1ScbyU8m7DOWS_tgiBn1GFedlxKweOyWzRTf5Ft-BwbogodItU7BzfvLIXoYk0wHw-DbHeSDxz3p6_W7YJpERqRuQ7HZSlrm2aZdgkHKSD2WYAbeuozBxqL5E_4hPkrRRWtDoDJmErCCjYG9UodGxzUfitn1MtD6-Ml5usmPSphbikxjduspqHBgfCpmWIz1EwwF1L_dxA1XGYt1PMN7JzJwZ_00guDZ-fveukZCbEYpmR3SSs3apet2l3hOWyYuKjNkxTAEBA" 
                    />
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">1</span>
                </div>
                <span className="text-sm font-medium hidden md:block">Caio Bruno...</span>
                <span className="material-icons-outlined text-sm">expand_more</span>
            </div>
         )}

        {showActions && (
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <span className="material-icons-outlined text-text-light-secondary dark:text-text-dark-secondary">more_vert</span>
            </button>
        )}

        {user && (
          <button onClick={() => signOut()} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-light dark:bg-surface-dark shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <span className="material-icons-outlined text-text-light-secondary dark:text-text-dark-secondary">logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
