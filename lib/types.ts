export type TransactionType = 'expense' | 'income' | 'investment';

export type Category =
  | 'מזון מהבית'
  | 'אוכל בחוץ'
  | 'רכב'
  | 'תחבורה ציבורית'
  | 'ביגוד והנעלה'
  | 'קניות אונליין'
  | 'קניות לבית'
  | 'מוצרי חשמל וטכנולוגיה'
  | 'בריאות ורפואה'
  | 'קוסמטיקה וטיפוח'
  | 'ספורט וכושר'
  | 'בילויים ופנאי'
  | 'חינוך וקורסים'
  | 'חשבונות ותשלומים'
  | 'ביטוחים'
  | 'נסיעות וחופשות'
  | 'מתנות ותרומות'
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

export interface Budget {
  category: Category;
  month: number;
  year: number;
  amount: number;
}
