import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { DateNavigator } from '../components/DateNavigator';
import { StatCard } from '../components/StatCard';
import { listTransactions } from '../services/transactions';
import { Transaction } from '../types';

const Transactions: React.FC = () => {
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    listTransactions().then(({ data, error }) => {
      if (!mounted) return
      if (error) setError(error.message)
      setItems(data || [])
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  const totals = useMemo(() => {
    const income = items.filter(i => i.type === 'income').reduce((acc, cur) => acc + cur.amount, 0)
    const expense = items.filter(i => i.type === 'expense').reduce((acc, cur) => acc + cur.amount, 0)
    const balance = income - expense
    return { income, expense, balance }
  }, [items])

  return (
    <div className="flex flex-col h-full">
      <Header showSearch showActions />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <Card className="p-6 h-full min-h-[400px] flex flex-col">
            <div className="mb-6">
                <DateNavigator 
                    currentDate="Novembro 2025" 
                    onPrev={() => {}} 
                    onNext={() => {}} 
                />
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 flex-grow">Carregando...</div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6 flex-grow">
                <img 
                  alt="Sem resultados" 
                  className="w-40 h-auto mb-6 opacity-80" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAG8TzYRu_qYbV3zrjXNgGU5Rg-ZHUxeuwxiT3ZyTh66mf-tCS9ttvaFcMSaFgW0GVpmbn_0jyOb7s4UzvBQB2Raxt6gC5C0cT9yNPt8sl6gmXdp_o3GlRyAdJs3Wk8PYfbZistTteOK_8vZsggEu9kMN3GMbFR-0VoKCYpUHxYyqkdew5BpmfnM1i2Svn4ApRk0hTmzEluqdkKv8VMJM04dT0slPrInac8aR2tpDTvNNPH7SF-cf2VxS0K120OG4CpDqNNQPeIeMK"
                />
                <p className="font-semibold text-text-light-secondary dark:text-text-dark-secondary text-lg">Nenhum resultado</p>
                <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-2">Tente ajustar seus filtros ou adicione uma nova transação.</p>
                {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
              </div>
            ) : (
              <div className="flex flex-col gap-3 flex-grow overflow-auto">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{t.description}</p>
                      <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary">{t.date} • {t.category}</span>
                    </div>
                    <div className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-4">
          <StatCard
            layout="vertical"
            label="Saldo atual"
            value={totals.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon="account_balance"
            iconBg="bg-blue-100 dark:bg-blue-900/50"
            iconColor="text-blue-500 dark:text-blue-300"
            onClick={() => {}}
          />

          <StatCard
            layout="vertical"
            label="Receitas"
            value={totals.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon="arrow_upward"
            iconBg="bg-green-100 dark:bg-green-900/50"
            iconColor="text-green-500 dark:text-green-300"
          />

          <StatCard
            layout="vertical"
            label="Despesas"
            value={totals.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon="arrow_downward"
            iconBg="bg-red-100 dark:bg-red-900/50"
            iconColor="text-red-500 dark:text-red-300"
          />

          <StatCard
            layout="vertical"
            label="Balanço mensal"
            value={totals.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon="account_balance_wallet"
            iconBg="bg-teal-100 dark:bg-teal-900/50"
            iconColor="text-teal-500 dark:text-teal-300"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
