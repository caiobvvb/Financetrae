import React, { useState } from 'react';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';

// Mock Data para Receitas
const incomeData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Abr', value: 2780 },
  { name: 'Mai', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

// Mock Data para Despesas
const expenseData = [
  { name: 'Jan', value: 2400 },
  { name: 'Fev', value: 1398 },
  { name: 'Mar', value: 9800 },
  { name: 'Abr', value: 3908 },
  { name: 'Mai', value: 4800 },
  { name: 'Jun', value: 3800 },
  { name: 'Jul', value: 4300 },
];

const SummaryBlock: React.FC<{ title: string; value: string; variant: 'blue' | 'green' | 'red' }> = ({ title, value, variant }) => {
    const styles = {
        blue: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 value-blue-900 dark:value-blue-100",
        green: "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 value-green-900 dark:value-green-100",
        red: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 value-red-900 dark:value-red-100"
    }
    const colors = {
        blue: "text-blue-900 dark:text-blue-100",
        green: "text-green-900 dark:text-green-100",
        red: "text-red-900 dark:text-red-100"
    }

    return (
        <div className={`${styles[variant].split(' value')[0]} p-5 rounded-lg border transition-transform hover:scale-105 duration-200 cursor-default`}>
          <p className="text-sm font-medium uppercase tracking-wide opacity-90">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${colors[variant]}`}>{value}</p>
        </div>
    )
}

const Reports: React.FC = () => {
  const [chartView, setChartView] = useState<'income' | 'expense'>('income');
  const [activeFilter, setActiveFilter] = useState<string>('month');

  // Dados e Cores dinâmicos baseados na seleção
  const currentData = chartView === 'income' ? incomeData : expenseData;
  const chartColor = chartView === 'income' ? '#10B981' : '#EF4444'; // Green or Red
  const gradientId = chartView === 'income' ? 'colorIncome' : 'colorExpense';

  return (
    <div className="flex flex-col h-full space-y-8 pb-10">
      <Header title=" " />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Relatórios Financeiros</h1>
        <div className="flex items-center space-x-2">
            <Button variant="icon" size="icon" title="Baixar PDF"><span className="material-icons-outlined">download</span></Button>
            <Button variant="icon" size="icon" title="Compartilhar"><span className="material-icons-outlined">share</span></Button>
        </div>
      </div>

      {/* Filtros Interativos */}
      <div className="flex flex-wrap items-center gap-3">
          {[
              { label: 'Este Mês', value: 'month', icon: 'calendar_today' },
              { label: 'Todas as Categorias', value: 'categories', icon: 'category' },
              { label: 'Todas as Contas', value: 'accounts', icon: 'account_balance_wallet' }
          ].map((filter) => (
            <Button
                key={filter.value}
                variant="outline"
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-lg shadow-sm border-border-light dark:border-border-dark transition-all ${
                    activeFilter === filter.value 
                    ? 'bg-primary/10 border-primary text-primary dark:text-white dark:bg-primary/30 ring-1 ring-primary' 
                    : 'bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
                <span className={`material-icons-outlined text-lg mr-2 ${activeFilter === filter.value ? 'text-primary dark:text-white' : ''}`}>{filter.icon}</span>
                <span>{filter.label}</span>
                <span className="material-icons-outlined text-lg ml-1 opacity-50">expand_more</span>
            </Button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryBlock title="Total de Receitas" value="R$ 7.850,00" variant="green" />
        <SummaryBlock title="Total de Despesas" value="R$ 4.120,50" variant="red" />
        <SummaryBlock title="Balanço Final" value="R$ 3.729,50" variant="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Evolução */}
        <Card className="lg:col-span-2 p-6 flex flex-col h-[400px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Evolução Financeira</h2>
            
            {/* Toggle de Visualização do Gráfico */}
            <div className="flex items-center text-sm border border-border-light dark:border-border-dark rounded-full p-1 bg-gray-50 dark:bg-gray-800">
              <button 
                onClick={() => setChartView('income')}
                className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                    chartView === 'income' 
                    ? 'bg-green-500 text-white shadow-sm' 
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary'
                }`}
              >
                Receitas
              </button>
              <button 
                onClick={() => setChartView('expense')}
                className={`px-4 py-1.5 rounded-full font-medium transition-all ${
                    chartView === 'expense' 
                    ? 'bg-red-500 text-white shadow-sm' 
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary'
                }`}
              >
                Despesas
              </button>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}} 
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}} 
                    tickFormatter={(value) => `k${value/1000}`}
                />
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151'
                    }}
                    cursor={{ stroke: '#6B7280', strokeWidth: 1, strokeDasharray: '4 4' }}
                    formatter={(value: number) => [`R$ ${value}`, chartView === 'income' ? 'Receita' : 'Despesa']}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={chartColor} 
                    fillOpacity={1} 
                    fill={`url(#${gradientId})`} 
                    strokeWidth={3} 
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categorias */}
        <Card className="p-6 h-[400px] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-text-light-primary dark:text-text-dark-primary">Despesas por Categoria</h2>
            <Button variant="ghost" size="icon" className="rounded-full"><span className="material-icons-outlined">more_horiz</span></Button>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Alimentação', val: 1854.22, color: 'bg-blue-500', width: '45%' },
              { label: 'Transporte', val: 1030.12, color: 'bg-green-500', width: '25%' },
              { label: 'Moradia', val: 618.07, color: 'bg-red-500', width: '15%' },
              { label: 'Lazer', val: 412.05, color: 'bg-yellow-500', width: '10%' },
              { label: 'Saúde', val: 350.00, color: 'bg-cyan-500', width: '8%' },
              { label: 'Outros', val: 206.04, color: 'bg-purple-500', width: '5%' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-default">
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <p className="text-text-light-primary dark:text-text-dark-primary font-medium text-sm">{item.label}</p>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary font-semibold text-xs">R$ {item.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-2 rounded-full transition-all duration-500 ease-out group-hover:opacity-80`} style={{ width: item.width }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;