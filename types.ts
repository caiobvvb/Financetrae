export interface NavItem {
  icon: string;
  label: string;
  path: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  status: 'paid' | 'pending'; // Adicionado para controle do calendário
}

export interface Budget {
  id: string;
  category: string;
  icon: string;
  iconBg: string;
  spent: number;
  limit: number;
  period: string;
  color: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  predictedBalance?: number;
  type: 'wallet' | 'bank' | 'investment';
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  currentInvoice: number;
  dueDate: string;
}