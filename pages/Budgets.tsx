import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';
import { FilterPills } from '../components/FilterPills';
import { BudgetCard } from '../components/BudgetCard';
import { Modal } from '../components/ui/Modal';
import { listBudgets, createBudget } from '../services/budgets';
import { useAuth } from '../contexts/AuthProvider';
import { Budget } from '../types';

function computeBudgetVisual(b: Budget) {
  const percentage = b.limit > 0 ? (b.spent / b.limit) * 100 : 0
  let color = 'text-green-600 dark:text-green-400'
  let barColor = 'bg-green-500'
  let warning = false
  if (percentage > 100) { color = 'text-red-600 dark:text-red-400'; barColor = 'bg-red-500'; warning = true }
  else if (percentage > 85) { color = 'text-yellow-600 dark:text-yellow-400'; barColor = 'bg-yellow-500' }
  return { color, barColor, warning }
}

const BudgetForm: React.FC<{ onClose: () => void, onCreated: () => void }> = ({ onClose, onCreated }) => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        category: '',
        limit: '',
        spent: '',
        icon: '💰',
        period: 'Novembro'
    });

    const icons = ['💰', '🍔', '🚗', '🏠', '🎬', '✈️', '🛒', '💊', '🎓', '🎁'];

    const handleSubmit = async () => {
        if (!user) return
        const limit = parseFloat(formData.limit) || 0;
        const spent = parseFloat(formData.spent) || 0;
        const iconBg = 'bg-primary/10'
        const { error } = await createBudget({
            user_id: user.id,
            category: formData.category || 'Nova Categoria',
            icon: formData.icon,
            iconBg,
            period: formData.period,
            spent,
            limit,
            color: 'text-green-600 dark:text-green-400'
        })
        if (!error) { onCreated(); onClose() }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Categoria</label>
                <input 
                    type="text" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
                    placeholder="Ex: Viagem de Férias" 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Limite (R$)</label>
                    <input 
                        type="number" 
                        value={formData.limit}
                        onChange={e => setFormData({...formData, limit: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
                        placeholder="0,00" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Gasto Atual (R$)</label>
                    <input 
                        type="number" 
                        value={formData.spent}
                        onChange={e => setFormData({...formData, spent: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
                        placeholder="0,00" 
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-2">Ícone</label>
                <div className="flex gap-2 flex-wrap bg-background-light dark:bg-background-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
                    {icons.map((icon) => (
                        <button 
                            key={icon} 
                            onClick={() => setFormData({...formData, icon})}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${formData.icon === icon ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            {icon}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Período</label>
                <select 
                    value={formData.period}
                    onChange={e => setFormData({...formData, period: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary"
                >
                    <option>Novembro</option>
                    <option>Dezembro</option>
                    <option>Janeiro</option>
                    <option>Anual</option>
                </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-4">
                <Button variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
                <Button fullWidth onClick={handleSubmit}>Criar Orçamento</Button>
            </div>
        </div>
    );
};

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeFilter, setActiveFilter] = useState('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true)

  const reload = () => {
    setLoading(true)
    listBudgets().then(({ data }) => { setBudgets(data || []); setLoading(false) })
  }
  useEffect(() => { reload() }, [])

  const filters = [
    { label: 'Ativos', value: 'active' },
    { label: 'Excedidos', value: 'exceeded' },
    { label: 'Mês Atual', value: 'current' }, // Placeholder logic
  ];

  const filteredBudgets = useMemo(() => budgets.filter(budget => {
      if (activeFilter === 'exceeded') return budget.spent > budget.limit;
      if (activeFilter === 'current') return budget.period === 'Novembro';
      return true;
  }), [budgets, activeFilter])

  return (
    <div className="flex flex-col h-full space-y-8 pb-10">
      <Header title=" " />
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Orçamentos</h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">Crie orçamentos para suas categorias e acompanhe seus gastos de perto.</p>
        </div>
        <Button variant="primary" size="lg" className="mt-4 md:mt-0" onClick={() => setIsModalOpen(true)}>
          <span className="material-icons-outlined mr-2 text-xl">add</span>
          Novo Orçamento
        </Button>
      </div>

      <FilterPills 
        filters={filters} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter}
        variant="solid" 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <Card className="p-6">Carregando...</Card>
        ) : filteredBudgets.map((budget) => (
            <BudgetCard
                key={budget.id}
                category={budget.category}
                icon={budget.icon}
                iconBg={budget.iconBg}
                period={budget.period}
                spent={budget.spent}
                limit={budget.limit}
                color={computeBudgetVisual(budget).color}
                barColor={computeBudgetVisual(budget).barColor}
                warning={computeBudgetVisual(budget).warning}
            />
        ))}

        {/* Create New Card - Always visible unless filter is strictly exceeded maybe? Keeping it for UX */}
        <div 
            onClick={() => setIsModalOpen(true)}
            className="bg-transparent border-2 border-dashed border-border-light dark:border-border-dark p-6 rounded-xl flex flex-col items-center justify-center text-center hover:border-primary/50 dark:hover:border-primary/50 transition-colors cursor-pointer group h-full min-h-[250px]"
        >
          <button className="w-16 h-16 bg-surface-light dark:bg-surface-dark rounded-full flex items-center justify-center mb-4 border border-border-light dark:border-border-dark text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
            <span className="material-icons-outlined text-3xl">add</span>
          </button>
          <h3 className="font-semibold text-text-light-primary dark:text-text-dark-primary text-lg">Criar Novo Orçamento</h3>
          <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">Comece a organizar suas finanças.</p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Orçamento"
      >
          <BudgetForm onClose={() => setIsModalOpen(false)} onCreated={reload} />
      </Modal>
    </div>
  );
};

export default Budgets;
