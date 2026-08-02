import { Transaction, MonthlySummary } from './types';
import { CATEGORY_CONFIG } from './categories';

const currentYear = new Date().getFullYear();

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1',  date: `${currentYear}-08-01`, amount: 16500, description: 'משכורת לירז', category: 'שכר והכנסות', type: 'income', isFixed: true, source: 'bank' },
  { id: '2',  date: `${currentYear}-08-01`, amount: 12000, description: 'משכורת יובל', category: 'שכר והכנסות', type: 'income', isFixed: true, source: 'bank' },
  { id: '3',  date: `${currentYear}-08-01`, amount: 4800, description: 'שכירות', category: 'חשבונות וקבועים', type: 'expense', isFixed: true, source: 'bank' },
  { id: '4',  date: `${currentYear}-08-02`, amount: 380, description: 'חשמל', category: 'חשבונות וקבועים', type: 'expense', isFixed: true, source: 'bank' },
  { id: '5',  date: `${currentYear}-08-02`, amount: 120, description: 'מים', category: 'חשבונות וקבועים', type: 'expense', isFixed: true, source: 'bank' },
  { id: '6',  date: `${currentYear}-08-03`, amount: 250, description: 'אינטרנט + טלפון', category: 'חשבונות וקבועים', type: 'expense', isFixed: true, source: 'bank' },
  { id: '7',  date: `${currentYear}-08-03`, amount: 3000, description: 'קרן פנסיה', category: 'השקעות וחסכון', type: 'investment', isFixed: true, source: 'bank' },
  { id: '8',  date: `${currentYear}-08-04`, amount: 890, description: 'סופר שופרסל', category: 'מזון ומסעדות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '9',  date: `${currentYear}-08-05`, amount: 320, description: 'מסעדה ארוחת ערב', category: 'מזון ומסעדות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '10', date: `${currentYear}-08-06`, amount: 180, description: 'בנזין', category: 'תחבורה', type: 'expense', isFixed: false, source: 'credit' },
  { id: '11', date: `${currentYear}-08-07`, amount: 450, description: 'קניות בגדים', category: 'קניות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '12', date: `${currentYear}-08-08`, amount: 260, description: 'קולנוע + מסעדה', category: 'בילויים', type: 'expense', isFixed: false, source: 'credit' },
  { id: '13', date: `${currentYear}-08-10`, amount: 680, description: 'סופר יינות ביתן', category: 'מזון ומסעדות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '14', date: `${currentYear}-08-12`, amount: 150, description: 'תחבורה ציבורית', category: 'תחבורה', type: 'expense', isFixed: false, source: 'bank' },
  { id: '15', date: `${currentYear}-08-13`, amount: 340, description: 'ספא + טיפול', category: 'בריאות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '16', date: `${currentYear}-08-14`, amount: 1200, description: 'חיסכון חודשי', category: 'השקעות וחסכון', type: 'investment', isFixed: true, source: 'bank' },
  { id: '17', date: `${currentYear}-08-15`, amount: 290, description: 'ארוחת צהריים בעבודה', category: 'מזון ומסעדות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '18', date: `${currentYear}-08-17`, amount: 380, description: 'הופעה', category: 'בילויים', type: 'expense', isFixed: false, source: 'credit' },
  { id: '19', date: `${currentYear}-08-19`, amount: 220, description: 'תרופות בית מרקחת', category: 'בריאות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '20', date: `${currentYear}-08-20`, amount: 160, description: 'בנזין', category: 'תחבורה', type: 'expense', isFixed: false, source: 'credit' },
  { id: '21', date: `${currentYear}-08-21`, amount: 530, description: 'קניות אמזון', category: 'קניות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '22', date: `${currentYear}-08-22`, amount: 420, description: 'סופר', category: 'מזון ומסעדות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '23', date: `${currentYear}-08-24`, amount: 180, description: 'קפה + בוקר', category: 'מזון ומסעדות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '24', date: `${currentYear}-08-26`, amount: 650, description: 'ביגוד ספורט', category: 'קניות', type: 'expense', isFixed: false, source: 'credit' },
  { id: '25', date: `${currentYear}-08-27`, amount: 290, description: 'ארוחה חוץ', category: 'מזון ומסעדות', type: 'expense', isFixed: false, source: 'credit' },
];

function buildSummary(transactions: Transaction[], month: number, year: number): MonthlySummary {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalFixedExpenses = transactions
    .filter(t => t.type === 'expense' && t.isFixed)
    .reduce((s, t) => s + t.amount, 0);

  const totalMonthlyExpenses = transactions
    .filter(t => t.type === 'expense' && !t.isFixed)
    .reduce((s, t) => s + t.amount, 0);

  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((s, t) => s + t.amount, 0);

  const categoryMap = new Map<string, number>();
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount);
    });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => {
    const cfg = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
    return {
      category: category as any,
      amount,
      color: cfg?.color ?? '#94A3B8',
    };
  });

  return {
    month,
    year,
    totalIncome,
    totalMonthlyExpenses,
    totalFixedExpenses,
    totalInvestments,
    totalSaved: totalIncome - totalMonthlyExpenses - totalFixedExpenses - totalInvestments,
    categoryBreakdown,
    transactions,
  };
}

export const MOCK_CURRENT_MONTH = buildSummary(MOCK_TRANSACTIONS, new Date().getMonth() + 1, currentYear);

// Generate past months with slight variations
function variatedTransactions(month: number, factor: number): Transaction[] {
  return MOCK_TRANSACTIONS.map(t => ({
    ...t,
    id: `${month}-${t.id}`,
    date: t.date.replace(`${currentYear}-08`, `${currentYear}-0${month}`),
    amount: t.type === 'income' ? t.amount : Math.round(t.amount * factor),
  }));
}

export const MOCK_HISTORY: MonthlySummary[] = [
  buildSummary(variatedTransactions(5, 0.85), 5, currentYear),
  buildSummary(variatedTransactions(6, 1.12), 6, currentYear),
  buildSummary(variatedTransactions(7, 0.92), 7, currentYear),
  MOCK_CURRENT_MONTH,
];

export const MONTH_NAMES = [
  '', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];