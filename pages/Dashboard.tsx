import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
        {/* Banner */}
      <div className="bg-gray-800 dark:bg-black text-white text-center py-2 px-4 flex justify-center items-center rounded-none md:rounded-b-lg mb-6 shadow-sm">
        <span className="bg-sale-green text-black text-xs font-bold px-2 py-1 rounded-md mr-3">40% OFF</span>
        <p className="text-sm">Black do Futuro: FinancePro PRO com 40% OFF!</p>
      </div>

      <header className="px-1 py-4 flex justify-between items-center mb-6">
        <button className="bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-600 text-text-light-primary dark:text-text-dark-primary px-4 py-2 rounded-lg flex items-center space-x-2 text-sm shadow-sm hover:bg-gray-50">
          <span>novembro</span>
          <span className="material-icons-outlined text-base">expand_more</span>
        </button>
        
         <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="relative">
                    <img 
                        alt="Avatar" 
                        className="w-8 h-8 rounded-full" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDo0v1ScbyU8m7DOWS_tgiBn1GFedlxKweOyWzRTf5Ft-BwbogodItU7BzfvLIXoYk0wHw-DbHeSDxz3p6_W7YJpERqRuQ7HZSlrm2aZdgkHKSD2WYAbeuozBxqL5E_4hPkrRRWtDoDJmErCCjYG9UodGxzUfitn1MtD6-Ml5usmPSphbikxjduspqHBgfCpmWIz1EwwF1L_dxA1XGYt1PMN7JzJwZ_00guDZ-fveukZCbEYpmR3SSs3apet2l3hOWyYuKjNkxTAEBA" 
                    />
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">1</span>
                </div>
                <span className="text-sm font-medium hidden md:block">Caio Bruno...</span>
                <span className="material-icons-outlined text-sm">expand_more</span>
            </div>
      </header>

      <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Saldo atual</span>
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
              <span className="material-icons-outlined text-blue-500 dark:text-blue-400">account_balance</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary mt-2">R$ 1.250,00</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Receitas</span>
              <span className="material-icons-outlined text-sm text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
              <span className="material-icons-outlined text-green-500 dark:text-green-400">arrow_upward</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary mt-2">R$ 3.400,00</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Despesas</span>
            <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full">
              <span className="material-icons-outlined text-red-500 dark:text-red-400">arrow_downward</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary mt-2">R$ 2.150,00</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Cartão de crédito</span>
              <span className="material-icons-outlined text-sm text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>
            </div>
            <div className="bg-teal-100 dark:bg-teal-900/50 p-3 rounded-full">
              <span className="material-icons-outlined text-teal-500 dark:text-teal-400">credit_card</span>
            </div>
          </div>
          <p className="text-2xl font-semibold text-text-light-primary dark:text-text-dark-primary mt-2">R$ 980,00</p>
        </div>
      </div>

      <div className="bg-sale-blue rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white mb-8 relative overflow-hidden shadow-lg">
        <div className="flex items-center space-x-6 z-10 mb-4 md:mb-0">
          <div className="relative">
            <div className="absolute inset-0 border-4 border-purple-400 rounded-full animate-pulse"></div>
            <div className="w-24 h-24 bg-primary rounded-full flex flex-col items-center justify-center relative z-10 shadow-xl">
              <span className="text-3xl font-bold">40%</span>
              <span className="text-sm uppercase">OFF</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-lg">2 anos PRO com 40% OFF</p>
            <p className="text-sm text-white/80">IA no WhatsApp + Recursos Premium</p>
          </div>
        </div>
        <button className="bg-sale-green text-black font-bold px-8 py-3 rounded-full hover:bg-lime-400 transition-colors z-10 shadow-md">
           QUERO SER PRO
        </button>
        <button className="absolute top-4 right-4 text-white/70 hover:text-white">
          <span className="material-icons-outlined">close</span>
        </button>
         {/* Decorative circle */}
         <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-8 rounded-2xl flex flex-col items-center text-center relative border border-yellow-200 dark:border-yellow-800/50">
        <button className="absolute top-4 right-4 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary">
          <span className="material-icons-outlined">close</span>
        </button>
        <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
            {/* Replaced image with icon for stability */}
            <span className="material-icons-outlined text-4xl text-blue-600 dark:text-blue-300">analytics</span>
        </div>
        <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Chegou o Meu Desempenho!</h2>
        <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1 mb-4">Tenha controle mensal das suas receitas e gastos.</p>
        <a className="text-primary font-semibold flex items-center space-x-1 group hover:underline" href="#">
          <span>Conferir</span>
          <span className="material-icons-outlined transform transition-transform group-hover:translate-x-1">arrow_forward</span>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;