import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Transaction } from '../types';

// Mock Data
const mockTransactions: Transaction[] = [
  { id: '1', description: 'Salário', amount: 5000, date: '2025-11-05', category: 'Salário', type: 'income', status: 'paid' },
  { id: '2', description: 'Aluguel', amount: 1200, date: '2025-11-05', category: 'Moradia', type: 'expense', status: 'pending' },
  { id: '3', description: 'Supermercado', amount: 450, date: '2025-11-10', category: 'Alimentação', type: 'expense', status: 'paid' },
  { id: '4', description: 'Internet', amount: 120, date: '2025-11-15', category: 'Contas', type: 'expense', status: 'pending' },
  { id: '5', description: 'Freelance', amount: 800, date: '2025-11-15', category: 'Extra', type: 'income', status: 'pending' },
  { id: '6', description: 'Netflix', amount: 55.90, date: '2025-11-20', category: 'Lazer', type: 'expense', status: 'paid' },
  { id: '7', description: 'Academia', amount: 90, date: '2025-11-25', category: 'Saúde', type: 'expense', status: 'pending' },
  { id: '8', description: 'Combustível', amount: 200, date: '2025-11-28', category: 'Transporte', type: 'expense', status: 'pending' },
];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // Novembro 2025
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Helpers para manipulação de data
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  // Filtra transações baseadas nos filtros globais
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(t => {
      if (filterStatus !== 'all' && t.status !== filterStatus) return false;
      if (filterType !== 'all' && t.type !== filterType) return false;
      return true;
    });
  }, [filterStatus, filterType]);

  // Agrupa transações por dia para exibir no grid
  const transactionsByDate = useMemo(() => {
    const grouped: Record<string, { income: number, expense: number, items: Transaction[] }> = {};
    
    filteredTransactions.forEach(t => {
      // Considerando que o mock data está em YYYY-MM-DD
      const dateKey = parseInt(t.date.split('-')[2]).toString(); // Pega apenas o dia
      
      // Verifica se a transação pertence ao mês/ano atual
      const transDate = new Date(t.date + 'T12:00:00'); // Fix timezone issue for comparison
      if (transDate.getMonth() !== currentDate.getMonth() || transDate.getFullYear() !== currentDate.getFullYear()) {
          return;
      }

      if (!grouped[dateKey]) {
        grouped[dateKey] = { income: 0, expense: 0, items: [] };
      }
      
      if (t.type === 'income') grouped[dateKey].income += t.amount;
      else grouped[dateKey].expense += t.amount;
      
      grouped[dateKey].items.push(t);
    });
    return grouped;
  }, [filteredTransactions, currentDate]);

  // Transações do dia selecionado (ou todas do mês se nenhum dia selecionado)
  const detailList = useMemo(() => {
    if (selectedDate) {
      return transactionsByDate[selectedDate]?.items || [];
    }
    // Se não tiver dia selecionado, mostra todas do mês filtradas
    return filteredTransactions.filter(t => {
        const d = new Date(t.date + 'T12:00:00');
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedDate, transactionsByDate, filteredTransactions, currentDate]);

  // Renderização do Grid
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-gray-50/50 dark:bg-gray-800/20 border border-border-light dark:border-border-dark"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayString = day.toString();
      const dayData = transactionsByDate[dayString];
      const isSelected = selectedDate === dayString;
      const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          onClick={() => setSelectedDate(isSelected ? null : dayString)}
          className={`h-24 md:h-32 border border-border-light dark:border-border-dark p-2 cursor-pointer transition-colors relative flex flex-col justify-between
            ${isSelected ? 'bg-primary/10 border-primary dark:border-primary ring-1 ring-primary z-10' : 'hover:bg-gray-50 dark:hover:bg-gray-800 bg-surface-light dark:bg-surface-dark'}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-text-light-secondary dark:text-text-dark-secondary'}`}>
              {day}
            </span>
            {dayData && dayData.items.length > 0 && (
                <div className="flex gap-1">
                    {dayData.items.some(i => i.status === 'paid') && <span className="w-2 h-2 rounded-full bg-green-500" title="Pago/Recebido"></span>}
                    {dayData.items.some(i => i.status === 'pending') && <span className="w-2 h-2 rounded-full bg-yellow-500" title="Pendente"></span>}
                </div>
            )}
          </div>
          
          <div className="space-y-1">
            {dayData && dayData.income > 0 && (
              <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded truncate">
                + {dayData.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
            {dayData && dayData.expense > 0 && (
              <div className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded truncate">
                - {dayData.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="flex flex-col h-full space-y-6 pb-10">
      <Header title=" " />

      <div className="flex flex-col xl:flex-row gap-6 h-full">
        {/* Lado Esquerdo: Calendário */}
        <div className="flex-1 flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Calendário</h1>
                
                {/* Controles de Navegação */}
                <div className="flex items-center bg-surface-light dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark shadow-sm">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-text-light-secondary dark:text-text-dark-secondary">
                        <span className="material-icons-outlined">chevron_left</span>
                    </button>
                    <span className="px-4 font-semibold text-text-light-primary dark:text-text-dark-primary min-w-[150px] text-center capitalize">
                        {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-text-light-secondary dark:text-text-dark-secondary">
                        <span className="material-icons-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2 bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark">
                    <span className="text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary uppercase">Tipo:</span>
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="bg-transparent text-sm text-text-light-primary dark:text-text-dark-primary focus:outline-none"
                    >
                        <option value="all">Todos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2 bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark">
                    <span className="text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary uppercase">Status:</span>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-transparent text-sm text-text-light-primary dark:text-text-dark-primary focus:outline-none"
                    >
                        <option value="all">Todas</option>
                        <option value="paid">Pagas/Recebidas</option>
                        <option value="pending">A Pagar/Receber</option>
                    </select>
                </div>
                 {/* Filtro de categoria simulado */}
                 <div className="flex items-center space-x-2 bg-surface-light dark:bg-surface-dark px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark">
                    <span className="text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary uppercase">Categoria:</span>
                    <select className="bg-transparent text-sm text-text-light-primary dark:text-text-dark-primary focus:outline-none">
                        <option>Todas</option>
                        <option>Alimentação</option>
                        <option>Moradia</option>
                        <option>Lazer</option>
                    </select>
                </div>
            </div>
            
            {/* Grid do Calendário */}
            <Card className="flex-1 p-0 overflow-hidden shadow-sm flex flex-col">
                <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800/50 border-b border-border-light dark:border-border-dark">
                    {weekDays.map(day => (
                        <div key={day} className="py-2 text-center text-xs font-semibold text-text-light-secondary dark:text-text-dark-secondary uppercase tracking-wide">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 bg-background-light dark:bg-background-dark">
                    {renderCalendarDays()}
                </div>
            </Card>
        </div>

        {/* Lado Direito: Detalhes */}
        <div className="w-full xl:w-96 flex flex-col space-y-4">
             <Card className="p-6 h-full flex flex-col">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-light dark:border-border-dark">
                     <div>
                         <h2 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                             {selectedDate ? `Dia ${selectedDate}` : 'Resumo do Mês'}
                         </h2>
                         <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                             {detailList.length} {detailList.length === 1 ? 'transação' : 'transações'}
                         </p>
                     </div>
                     {selectedDate && (
                         <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)}>
                             Ver Mês
                         </Button>
                     )}
                 </div>

                 <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                     {detailList.length > 0 ? (
                         detailList.map((item) => (
                             <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                 <div className="flex items-center space-x-3">
                                     <div className={`p-2 rounded-full ${item.status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}>
                                         <span className="material-icons text-sm">
                                             {item.status === 'paid' ? 'check' : 'schedule'}
                                         </span>
                                     </div>
                                     <div>
                                         <p className="font-medium text-text-light-primary dark:text-text-dark-primary text-sm">{item.description}</p>
                                         <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">{item.category} • {item.date}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className={`font-bold text-sm ${item.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                         {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                     </p>
                                     <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">
                                         {item.status === 'paid' ? (item.type === 'income' ? 'Recebido' : 'Pago') : (item.type === 'income' ? 'A Receber' : 'A Pagar')}
                                     </span>
                                 </div>
                             </div>
                         ))
                     ) : (
                         <div className="text-center py-10 opacity-50">
                             <span className="material-icons-outlined text-4xl mb-2">event_busy</span>
                             <p>Nenhuma transação encontrada.</p>
                         </div>
                     )}
                 </div>

                 {/* Resumo Financeiro da Seleção */}
                 <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark space-y-2">
                     <div className="flex justify-between text-sm">
                         <span className="text-text-light-secondary dark:text-text-dark-secondary">Receitas</span>
                         <span className="text-green-600 dark:text-green-400 font-medium">
                             {detailList.filter(i => i.type === 'income').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </span>
                     </div>
                     <div className="flex justify-between text-sm">
                         <span className="text-text-light-secondary dark:text-text-dark-secondary">Despesas</span>
                         <span className="text-red-600 dark:text-red-400 font-medium">
                             {detailList.filter(i => i.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </span>
                     </div>
                 </div>
             </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;