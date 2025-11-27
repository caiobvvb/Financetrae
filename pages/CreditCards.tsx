import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/ui/Modal';
import { listCards, createCard } from '../services/cards';
import { useAuth } from '../contexts/AuthProvider';
import { CreditCard } from '../types';

// --- Subcomponentes de UI Locais ---

const NewItemCard: React.FC<{ label: string; iconColor?: string; onClick?: () => void }> = ({ label, iconColor = "text-primary", onClick }) => (
    <Card onClick={onClick} className="p-6 flex flex-col items-center justify-center text-center shadow-sm h-56 cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-current/10 group">
      <div className={`w-16 h-16 rounded-full border-2 border-dashed ${iconColor.replace('text-', 'border-')} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <span className={`material-icons-outlined ${iconColor} text-3xl`}>add</span>
      </div>
      <p className={`font-semibold ${iconColor === 'text-primary' ? 'text-text-light-primary dark:text-text-dark-primary' : iconColor}`}>{label}</p>
    </Card>
);

const EmptyStateCard: React.FC<{ text: string }> = ({ text }) => (
    <Card className="p-6 flex flex-col items-center justify-center text-center text-text-light-secondary dark:text-text-dark-secondary shadow-sm h-56 border border-dashed border-border-light dark:border-border-dark">
        <span className="material-icons-outlined text-5xl mb-4 opacity-50">credit_card_off</span>
        <p className="max-w-xs text-sm">{text}</p>
    </Card>
)

// --- Formulário ---

const CardForm: React.FC<{ onClose: () => void, onCreated: () => void }> = ({ onClose, onCreated }) => {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [limit, setLimit] = useState<number>(0)
  const [currentInvoice, setCurrentInvoice] = useState<number>(0)
  const [dueDay, setDueDay] = useState<number>(15)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const save = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const dueDate = new Date()
    dueDate.setDate(dueDay)
    const { error } = await createCard({ user_id: user.id, name, limit, currentInvoice, dueDate: dueDate.toISOString().slice(0,10) })
    if (error) setError(error.message)
    else { onCreated(); onClose() }
    setLoading(false)
  }
  return (
    <div className="space-y-4">
      <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Nome do Cartão</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
            placeholder="Ex: Nubank Platinum" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
      </div>
      <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Limite Total</label>
          <input 
            type="number" 
            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
            placeholder="R$ 0,00" 
            value={limit}
            onChange={(e) => setLimit(parseFloat(e.target.value))}
          />
      </div>
      <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Fatura atual</label>
          <input 
            type="number" 
            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
            placeholder="R$ 0,00" 
            value={currentInvoice}
            onChange={(e) => setCurrentInvoice(parseFloat(e.target.value))}
          />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Dia do Vencimento</label>
        <select className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" value={dueDay} onChange={(e) => setDueDay(parseInt(e.target.value))}>
          {[...Array(31)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-4">
          <Button variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
          <Button fullWidth onClick={save} className="bg-teal-500 hover:bg-teal-600 text-white" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Cartão'}</Button>
      </div>
    </div>
  )
}

// --- Componente Principal ---

const CreditCards: React.FC = () => {
  const [invoiceTab, setInvoiceTab] = useState<'open' | 'closed'>('open');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [items, setItems] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)
  const totals = useMemo(() => {
    const available = items.reduce((acc, cur) => acc + (cur.limit - (cur.currentInvoice || 0)), 0)
    const openInvoices = items.reduce((acc, cur) => acc + (cur.currentInvoice || 0), 0)
    const nextDue = items[0]?.dueDate || '-'
    return { available, openInvoices, nextDue }
  }, [items])
  const reload = () => {
    setLoading(true)
    listCards().then(({ data }) => { setItems(data || []); setLoading(false) })
  }
  useEffect(() => { reload() }, [])

  const handleMore = () => alert("Mais opções em breve!");

  return (
    <div className="flex flex-col h-full space-y-12 pb-10">
      <Header title=" " />

      {/* Cartões Section */}
      <section>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Cartões de crédito</h1>
          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            <div className="flex items-center bg-surface-light dark:bg-surface-dark p-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setInvoiceTab('open')}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  invoiceTab === 'open' 
                    ? 'bg-teal-500 text-white shadow' 
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Faturas abertas
              </button>
              <button 
                onClick={() => setInvoiceTab('closed')}
                className={`px-4 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  invoiceTab === 'closed' 
                    ? 'bg-teal-500 text-white shadow' 
                    : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Faturas fechadas
              </button>
            </div>
             <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-2 ml-2">
                 <Button variant="icon" size="icon" onClick={() => setIsCardModalOpen(true)} title="Adicionar Cartão">
                    <span className="material-icons-outlined">add</span>
                 </Button>
                 <Button variant="icon" size="icon" onClick={handleMore}>
                    <span className="material-icons-outlined">more_vert</span>
                 </Button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <NewItemCard label="Novo cartão de crédito" iconColor="text-teal-500" onClick={() => setIsCardModalOpen(true)} />
            {loading ? (
              <Card className="p-6 h-56 flex items-center justify-center">Carregando...</Card>
            ) : items.length === 0 ? (
              <EmptyStateCard text="Nenhum cartão cadastrado." />
            ) : (
              items.map((c) => (
                <Card key={c.id} className="p-6 flex flex-col justify-between shadow-sm h-56 border-l-4 border-teal-500">
                  <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-teal-500 bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg">credit_card</span>
                    <div>
                      <p className="font-bold text-text-light-primary dark:text-text-dark-primary">{c.name}</p>
                      <p className="text-xs text-text-light-secondary">Fatura Atual</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Vence em {c.dueDate}</p>
                    <p className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">{(c.currentInvoice || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, ((c.currentInvoice || 0) / c.limit) * 100)}%` }}></div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-4">
            <StatCard 
                layout="simple" 
                label={invoiceTab === 'open' ? "Sua próxima fatura vence em" : "Última fatura paga em"}
                value={invoiceTab === 'open' ? (totals.nextDue || '-') : "-"}
                icon="calendar_today" 
                iconBg="bg-teal-500" 
                iconColor="text-white" 
            />
            <StatCard 
                layout="simple" 
                label="Limite Disponível" 
                value={totals.available.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                icon="attach_money" 
                iconBg="bg-teal-500" 
                iconColor="text-white" 
            />
            <StatCard 
                layout="simple" 
                label={invoiceTab === 'open' ? "Valor total faturas abertas" : "Total pago este mês"}
                value={invoiceTab === 'open' ? totals.openInvoices.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00"} 
                icon="account_balance" 
                iconBg="bg-teal-500" 
                iconColor="text-white" 
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal 
        isOpen={isCardModalOpen} 
        onClose={() => setIsCardModalOpen(false)} 
        title="Novo Cartão de Crédito"
      >
        <CardForm onClose={() => setIsCardModalOpen(false)} onCreated={reload} />
      </Modal>

    </div>
  );
};

export default CreditCards;
