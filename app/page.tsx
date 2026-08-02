'use client';

import { useState } from 'react';
import StatCard from '@/components/StatCard';
import CategoryPieChart from '@/components/CategoryPieChart';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import TransactionDrawer, { DrawerConfig } from '@/components/TransactionDrawer';
import { MONTH_NAMES } from '@/lib/mock-data';
import { useTransactions } from '@/lib/useTransactions';
import { Transaction } from '@/lib/types';

const DRAWER_CONFIGS: Record<string, DrawerConfig> = {
  income: {
    title: 'הכנסות', icon: '💰', color: '#059669', bgColor: '#D1FAE5',
    filterFn: t => t.type === 'income', defaultType: 'income', defaultFixed: false,
  },
  monthly: {
    title: 'הוצאות חודשיות', icon: '🛒', color: '#7C3AED', bgColor: '#EDE9FE',
    filterFn: t => t.type === 'expense' && !t.isFixed, defaultType: 'expense', defaultFixed: false,
  },
  fixed: {
    title: 'הוצאות קבועות', icon: '🏠', color: '#D97706', bgColor: '#FEF3C7',
    filterFn: t => t.type === 'expense' && t.isFixed, defaultType: 'expense', defaultFixed: true,
  },
  invest: {
    title: 'השקעות / חסכון', icon: '📈', color: '#0EA5E9', bgColor: '#E0F2FE',
    filterFn: t => t.type === 'investment', defaultType: 'investment', defaultFixed: false,
  },
};

export default function DashboardPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { summary, loading, usingMock, addTransaction, deleteTransaction } = useTransactions(month, year);
  const [showAdd, setShowAdd] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const savingsRate = summary.totalIncome > 0
    ? Math.round(((summary.totalIncome - summary.totalMonthlyExpenses - summary.totalFixedExpenses) / summary.totalIncome) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 fade-up">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B4B]">{MONTH_NAMES[month]} {year}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-[#6B7280]">סיכום חודשי</p>
            {usingMock && (
              <span className="text-xs text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded-full font-medium">
                נתוני דמו
              </span>
            )}
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-[#E5E7EB] border-t-[#7C3AED] rounded-full spin inline-block" />
            )}
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <span className="text-lg leading-none">+</span>
          הוספת עסקה
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="הכנסות" amount={summary.totalIncome} icon="💰"
          color="#059669" bgColor="#D1FAE5" subtitle="לחצי לפירוט" delay={0}
          onClick={() => setActiveDrawer('income')} />
        <StatCard title="הוצאות חודשיות" amount={summary.totalMonthlyExpenses} icon="🛒"
          color="#7C3AED" bgColor="#EDE9FE" subtitle="לחצי לפירוט" delay={50}
          onClick={() => setActiveDrawer('monthly')} />
        <StatCard title="הוצאות קבועות" amount={summary.totalFixedExpenses} icon="🏠"
          color="#D97706" bgColor="#FEF3C7" subtitle="לחצי לפירוט" delay={100}
          onClick={() => setActiveDrawer('fixed')} />
        <StatCard title="השקעות / חסכון" amount={summary.totalInvestments} icon="📈"
          color="#0EA5E9" bgColor="#E0F2FE" subtitle={`${savingsRate}% מהכנסות`} delay={150}
          onClick={() => setActiveDrawer('invest')} />
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
          <span>{Math.round(((summary.totalMonthlyExpenses + summary.totalFixedExpenses) / summary.totalIncome) * 100)}% מהכנסות הוצא</span>
          <span>100%</span>
        </div>
      </div>

      {/* Chart + Transactions */}
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryPieChart summary={summary} />
        <TransactionList transactions={summary.transactions} limit={8} />
      </div>

      {showAdd && (
        <AddTransactionModal
          onClose={() => setShowAdd(false)}
          onAdd={(t: Transaction) => { addTransaction(t); setShowAdd(false); }}
        />
      )}

      {activeDrawer && DRAWER_CONFIGS[activeDrawer] && (
        <TransactionDrawer
          config={DRAWER_CONFIGS[activeDrawer]}
          transactions={summary.transactions}
          onClose={() => setActiveDrawer(null)}
          onAdd={addTransaction}
          onDelete={deleteTransaction}
        />
      )}
    </div>
  );
}
