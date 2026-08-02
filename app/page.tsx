'use client';

import { useState } from 'react';
import StatCard from '@/components/StatCard';
import CategoryPieChart from '@/components/CategoryPieChart';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import TransactionDrawer, { DrawerConfig } from '@/components/TransactionDrawer';
import { MOCK_CURRENT_MONTH, MONTH_NAMES } from '@/lib/mock-data';
import { Transaction } from '@/lib/types';

const DRAWER_CONFIGS: Record<string, DrawerConfig> = {
  income: {
    title: 'הכנסות',
    icon: '💰',
    color: '#059669',
    bgColor: '#D1FAE5',
    filterFn: t => t.type === 'income',
    defaultType: 'income',
    defaultFixed: false,
  },
  monthly: {
    title: 'הוצאות חודשיות',
    icon: '🛒',
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    filterFn: t => t.type === 'expense' && !t.isFixed,
    defaultType: 'expense',
    defaultFixed: false,
  },
  fixed: {
    title: 'הוצאות קבועות',
    icon: '🏠',
    color: '#D97706',
    bgColor: '#FEF3C7',
    filterFn: t => t.type === 'expense' && t.isFixed,
    defaultType: 'expense',
    defaultFixed: true,
  },
  invest: {
    title: 'השקעות / חסכון',
    icon: '📈',
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    filterFn: t => t.type === 'investment',
    defaultType: 'investment',
    defaultFixed: false,
  },
};

function rebuildSummary(transactions: Transaction[], prev: typeof MOCK_CURRENT_MONTH) {
  const totalIncome = transactions.filter(x => x.type === 'income').reduce((s, x) => s + x.amount, 0);
  const totalFixedExpenses = transactions.filter(x => x.type === 'expense' && x.isFixed).reduce((s, x) => s + x.amount, 0);
  const totalMonthlyExpenses = transactions.filter(x => x.type === 'expense' && !x.isFixed).reduce((s, x) => s + x.amount, 0);
  const totalInvestments = transactions.filter(x => x.type === 'investment').reduce((s, x) => s + x.amount, 0);

  const catMap = new Map<string, number>();
  transactions.filter(x => x.type === 'expense').forEach(x => {
    catMap.set(x.category, (catMap.get(x.category) ?? 0) + x.amount);
  });

  return {
    ...prev,
    transactions,
    totalIncome,
    totalFixedExpenses,
    totalMonthlyExpenses,
    totalInvestments,
    totalSaved: totalIncome - totalMonthlyExpenses - totalFixedExpenses - totalInvestments,
    categoryBreakdown: Array.from(catMap.entries()).map(([cat, amount]) => ({
      category: cat as any,
      amount,
      color: prev.categoryBreakdown.find(c => c.category === cat)?.color ?? '#94A3B8',
    })),
  };
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(MOCK_CURRENT_MONTH);
  const [showAdd, setShowAdd] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const now = new Date();
  const monthName = MONTH_NAMES[now.getMonth() + 1];
  const year = now.getFullYear();

  const savingsRate = summary.totalIncome > 0
    ? Math.round(((summary.totalIncome - summary.totalMonthlyExpenses - summary.totalFixedExpenses) / summary.totalIncome) * 100)
    : 0;

  function handleAdd(t: Transaction) {
    setSummary(prev => rebuildSummary([...prev.transactions, t], prev));
  }

  function handleDelete(id: string) {
    setSummary(prev => rebuildSummary(prev.transactions.filter(t => t.id !== id), prev));
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 fade-up">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B4B]">{monthName} {year}</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">סיכום חודשי</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <span className="text-lg leading-none">+</span>
          הוספת עסקה
        </button>
      </div>

      {/* Stat cards — all clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="הכנסות"
          amount={summary.totalIncome}
          icon="💰"
          color="#059669"
          bgColor="#D1FAE5"
          subtitle="לחצי לפירוט"
          delay={0}
          onClick={() => setActiveDrawer('income')}
        />
        <StatCard
          title="הוצאות חודשיות"
          amount={summary.totalMonthlyExpenses}
          icon="🛒"
          color="#7C3AED"
          bgColor="#EDE9FE"
          subtitle="לחצי לפירוט"
          delay={50}
          onClick={() => setActiveDrawer('monthly')}
        />
        <StatCard
          title="הוצאות קבועות"
          amount={summary.totalFixedExpenses}
          icon="🏠"
          color="#D97706"
          bgColor="#FEF3C7"
          subtitle="לחצי לפירוט"
          delay={100}
          onClick={() => setActiveDrawer('fixed')}
        />
        <StatCard
          title="השקעות / חסכון"
          amount={summary.totalInvestments}
          icon="📈"
          color="#0EA5E9"
          bgColor="#E0F2FE"
          subtitle={`${savingsRate}% מהכנסות`}
          delay={150}
          onClick={() => setActiveDrawer('invest')}
        />
      </div>

      {/* Balance bar */}
      <div className="card p-5 mb-6 fade-up delay-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[#1E1B4B]">מה נשאר החודש</span>
          <span className={`text-base font-bold ${summary.totalSaved >= 0 ? 'text-[#059669]' : 'text-[#EF4444]'}`}>
            {summary.totalSaved >= 0 ? '+' : ''}
            {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(summary.totalSaved)}
          </span>
        </div>
        <div className="w-full h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(0, ((summary.totalMonthlyExpenses + summary.totalFixedExpenses) / summary.totalIncome) * 100))}%`,
              background: summary.totalSaved < 0 ? '#EF4444' : summary.totalSaved < summary.totalIncome * 0.1 ? '#F59E0B' : '#7C3AED',
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-[#9CA3AF]">
          <span>0%</span>
          <span>
            {Math.round(((summary.totalMonthlyExpenses + summary.totalFixedExpenses) / summary.totalIncome) * 100)}% מהכנסות הוצא
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Chart + Transactions */}
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryPieChart summary={summary} />
        <TransactionList transactions={summary.transactions} limit={8} />
      </div>

      {/* Modals & Drawers */}
      {showAdd && (
        <AddTransactionModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}

      {activeDrawer && DRAWER_CONFIGS[activeDrawer] && (
        <TransactionDrawer
          config={DRAWER_CONFIGS[activeDrawer]}
          transactions={summary.transactions}
          onClose={() => setActiveDrawer(null)}
          onAdd={t => { handleAdd(t); }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
