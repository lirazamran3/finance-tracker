'use client';

import { useState } from 'react';
import StatCard from '@/components/StatCard';
import CategoryPieChart from '@/components/CategoryPieChart';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import TransactionList from '@/components/TransactionList';
import { useTransactions } from '@/lib/useTransactions';

const MONTH_NAMES: Record<number, string> = {
  1:'ינואר',2:'פברואר',3:'מרץ',4:'אפריל',5:'מאי',6:'יוני',
  7:'יולי',8:'אוגוסט',9:'ספטמבר',10:'אוקטובר',11:'נובמבר',12:'דצמבר',
};

function getAvailableMonths() {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ month: d.getMonth() + 1, year: d.getFullYear() });
  }
  return months;
}

const AVAILABLE_MONTHS = getAvailableMonths();

export default function HistoryPage() {
  const [selectedIdx, setSelectedIdx] = useState(AVAILABLE_MONTHS.length - 1);
  const { month, year } = AVAILABLE_MONTHS[selectedIdx];
  const prevEntry = selectedIdx > 0 ? AVAILABLE_MONTHS[selectedIdx - 1] : null;

  const { summary, loading, updateCategory } = useTransactions(month, year);
  const { summary: prevSummary } = useTransactions(
    prevEntry?.month ?? month,
    prevEntry?.year ?? year
  );

  function delta(curr: number, old: number) {
    if (!old) return null;
    return ((curr - old) / old) * 100;
  }

  const incDelta = prevEntry ? delta(summary.totalIncome, prevSummary.totalIncome) : null;
  const expDelta = prevEntry
    ? delta(
        summary.totalMonthlyExpenses + summary.totalFixedExpenses,
        prevSummary.totalMonthlyExpenses + prevSummary.totalFixedExpenses
      )
    : null;

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-0">
      <div className="fade-up mb-8">
        <h2 className="text-2xl font-bold text-[#1E1B4B]">היסטוריה</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">מעקב לאורך זמן</p>
      </div>

      {/* Month selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 fade-up delay-1">
        {AVAILABLE_MONTHS.map((m, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${selectedIdx === i
                ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#7C3AED] hover:text-[#7C3AED]'
              }`}
          >
            {MONTH_NAMES[m.month]} {m.year}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#9CA3AF] mb-4">
          <span className="w-4 h-4 border-2 border-[#E5E7EB] border-t-[#7C3AED] rounded-full spin inline-block" />
          טוען נתונים...
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="הכנסות" amount={summary.totalIncome} icon="💰"
          color="#059669" bgColor="#D1FAE5" delay={0}
          subtitle={incDelta !== null ? `${incDelta > 0 ? '+' : ''}${incDelta.toFixed(0)}% מהחודש הקודם` : undefined}
        />
        <StatCard
          title="הוצאות חודשיות" amount={summary.totalMonthlyExpenses} icon="🛒"
          color="#7C3AED" bgColor="#EDE9FE" delay={50}
          subtitle={expDelta !== null ? `${expDelta > 0 ? '+' : ''}${expDelta.toFixed(0)}% מהחודש הקודם` : undefined}
        />
        <StatCard
          title="הוצאות קבועות" amount={summary.totalFixedExpenses} icon="🏠"
          color="#D97706" bgColor="#FEF3C7" delay={100}
        />
        <StatCard
          title="חסכון" amount={summary.totalInvestments} icon="📈"
          color="#0EA5E9" bgColor="#E0F2FE" delay={150}
        />
      </div>

      {/* Pie + transactions */}
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryPieChart summary={summary} />
        <TransactionList
          transactions={summary.transactions}
          limit={10}
          onUpdateCategory={updateCategory}
        />
      </div>
    </div>
  );
}
