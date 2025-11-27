import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/StatCard';
import { Modal } from '../components/ui/Modal';
import { listAccounts, createAccount } from '../services/accounts';
import { useAuth } from '../contexts/AuthProvider';
import { Account } from '../types';

// --- Subcomponentes de UI Locais ---

const NewItemCard: React.FC<{ label: string; iconColor?: string; onClick?: () => void }> = ({ label, iconColor = "text-primary", onClick }) => (
    <Card onClick={onClick} className="p-6 flex flex-col items-center justify-center text-center shadow-sm h-56 cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-current/10 group">
      <div className={`w-16 h-16 rounded-full border-2 border-dashed ${iconColor.replace('text-', 'border-')} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <span className={`material-icons-outlined ${iconColor} text-3xl`}>add</span>
      </div>
      <p className={`font-semibold ${iconColor === 'text-primary' ? 'text-text-light-primary dark:text-text-dark-primary' : iconColor}`}>{label}</p>
    </Card>
);

const WalletCard: React.FC = () => (
    <Card className="p-6 flex flex-col justify-between shadow-sm h-56 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
        <div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-3">
            <span className="material-icons-outlined text-primary bg-primary/10 p-2 rounded-lg">account_balance_wallet</span>
            <span className="font-semibold text-text-light-primary dark:text-text-dark-primary text-lg">Carteira</span>
            </div>
            <button className="text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary">
            <span className="material-icons-outlined">more_vert</span>
            </button>
        </div>
        <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center text-sm">
            <span className="text-text-light-secondary dark:text-text-dark-secondary">Saldo atual</span>
            <span className="font-semibold text-green-600 dark:text-green-400 text-lg">R$ 1.250,00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
            <span className="text-text-light-secondary dark:text-text-dark-secondary flex items-center gap-1">
                Saldo previsto <span className="material-icons-outlined text-[10px]">info</span>
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">R$ 1.250,00</span>
            </div>
        </div>
        </div>
        <button className="text-primary font-bold text-sm self-start hover:underline uppercase tracking-wide relative z-10">Adicionar Despesa</button>
    </Card>
);

const AccountCard: React.FC<{ account: Account }> = ({ account }) => (
    <Card className="p-6 flex flex-col justify-between shadow-sm h-56 relative overflow-hidden group hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500"></div>
        <div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-3">
            <span className="material-icons-outlined text-primary bg-primary/10 p-2 rounded-lg">account_balance_wallet</span>
            <span className="font-semibold text-text-light-primary dark:text-text-dark-primary text-lg">{account.name}</span>
            </div>
            <button className="text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary">
            <span className="material-icons-outlined">more_vert</span>
            </button>
        </div>
        <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center text-sm">
            <span className="text-text-light-secondary dark:text-text-dark-secondary">Saldo atual</span>
            <span className="font-semibold text-green-600 dark:text-green-400 text-lg">{account.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
        </div>
        </div>
        <button className="text-primary font-bold text-sm self-start hover:underline uppercase tracking-wide relative z-10">Adicionar Despesa</button>
    </Card>
);

// --- Formulários ---

const AccountForm: React.FC<{ onClose: () => void, onCreated: () => void }> = ({ onClose, onCreated }) => {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [type, setType] = useState<'wallet' | 'bank' | 'investment'>('wallet')
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const save = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const { error } = await createAccount({ user_id: user.id, name, balance, type })
    if (error) setError(error.message)
    else { onCreated(); onClose() }
    setLoading(false)
  }
  return (
    <div className="space-y-4">
      <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Nome da Conta</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
            placeholder="Ex: Banco Principal" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Tipo</label>
          <select className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="wallet">Carteira</option>
            <option value="bank">Banco</option>
            <option value="investment">Investimentos</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Saldo Inicial</label>
          <input 
            type="number" 
            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
            placeholder="R$ 0,00" 
            value={balance}
            onChange={(e) => setBalance(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-2">Cor do ícone</label>
          <div className="flex gap-3">
            {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'].map((color, i) => (
               <button key={i} className={`${color} w-8 h-8 rounded-full hover:ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600 transition-all`}></button>
            ))}
          </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-4">
          <Button variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
          <Button fullWidth onClick={save} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Conta'}</Button>
      </div>
    </div>
  )
}

// --- Componente Principal ---

const Accounts: React.FC = () => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [items, setItems] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const totals = useMemo(() => {
    const balance = items.reduce((acc, cur) => acc + cur.balance, 0)
    return { balance }
  }, [items])
  const reload = () => {
    setLoading(true)
    listAccounts().then(({ data }) => { setItems(data || []); setLoading(false) })
  }
  useEffect(() => { reload() }, [])

  // Handlers para os botões de ação
  const handleDelete = () => alert("Selecione um item para remover (Funcionalidade em desenvolvimento)");
  const handleMore = () => alert("Mais opções em breve!");

  return (
    <div className="flex flex-col h-full space-y-12 pb-10">
      <Header title=" " />

      {/* Contas Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-text-light-primary dark:text-text-dark-primary">Minhas Contas</h1>
          <div className="flex items-center gap-2">
            <Button variant="icon" size="icon" onClick={() => setIsAccountModalOpen(true)} title="Adicionar Conta">
                <span className="material-icons-outlined">add</span>
            </Button>
            <Button variant="icon" size="icon" onClick={handleDelete} title="Remover Conta">
                <span className="material-icons-outlined">remove</span>
            </Button>
            <Button variant="icon" size="icon" onClick={handleMore} title="Mais opções">
                <span className="material-icons-outlined">more_vert</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <NewItemCard label="Nova conta" onClick={() => setIsAccountModalOpen(true)} />
            {loading ? (
              <Card className="p-6 h-56 flex items-center justify-center">Carregando...</Card>
            ) : items.length === 0 ? (
              <Card className="p-6 h-56 flex items-center justify-center">Nenhuma conta</Card>
            ) : (
              items.map((a) => (<AccountCard key={a.id} account={a} />))
            )}
          </div>

          <div className="space-y-4">
            <StatCard 
                layout="simple"
                label="Saldo acumulado" 
                value={totals.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
                icon="account_balance" 
                iconBg="bg-primary" 
                iconColor="text-white"
            />
             <StatCard 
                layout="simple"
                label="Receita Mensal" 
                value="R$ 3.400,00" 
                icon="trending_up" 
                iconBg="bg-green-500" 
                iconColor="text-white"
            />
            <StatCard 
                layout="simple"
                label="Despesa Mensal" 
                value="R$ 2.150,00" 
                icon="trending_down" 
                iconBg="bg-red-500" 
                iconColor="text-white"
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        title="Nova Conta"
      >
        <AccountForm onClose={() => setIsAccountModalOpen(false)} onCreated={reload} />
      </Modal>

    </div>
  );
};

export default Accounts;
