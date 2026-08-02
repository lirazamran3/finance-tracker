export type TransactionType = 'expense' | 'income' | 'investment';

export type Category =
  | 'מזון ומסעדות'
  | 'תחבורה'
  | 'בילויים'
  | 'קניות'
  | 'חשבונות וקבועים'
  | 'בריאות'
  | 'השקעות וחסכון'
  | 'שכר והכנסות'
  | 'אחר';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: Category;
  type: TransactionType;
  isFixed: boolean;
  source: 'manual' | 'bank' | 'credit';
}

export interface MonthlySummary {
  month: number;
  year: number;
  totalIncome: number;
  totalMonthlyExpenses: number;
  totalFixedExpenses: number;
  totalInvestments: number;
  totalSaved: number;
  categoryBreakdown: { category: Category; amount: number; color: string }[];
  transactions: Transaction[];
}
