'use client';

import { useState } from 'react';
import StatCard from '@/components/StatCard';
import CategoryPieChart from '@/components/CategoryPieChart';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import TransactionList from '@/components/TransactionList';
import { MOCK_HISTORY, MONTH_NAMES } from '@/lib/mock-data';

export default function HistoryPage() {
  const [selectedIdx, setSelectedIdx] = useState(MOCK_HISTORY.length - 1);
  const summary = MOCK_HISTORY[selectedIdx];

  const prev = selectedIdx > 0 ? MOCK_HISTORY[selectedIdx - 1] : null;

  function delta(curr: number, old: number | undefined) {
    if (!old) return null;
    const d = ((curr - old) / old) * 100;
    return d;
  }

  const incDelta   = delta(summary.totalIncome, prev?.totalIncome);
  const expDelta   = delta(summary.totalMonthlyExpenses + summary.totalFixedExpenses, prev ? prev.totalMonthlyExpenses + prev.totalFixedExpenses : undefined);

  return (
    <div className="max-w-5xl mx-auto pb-24 md:pb-0">
      <div className="fade-up mb-8">
        <h2 className="text-2xl font-bold text-[#1E1B4B]">היסטוריה</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">מעקב לאורך זמן</p>
      </div>

      {/* Month selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 fade-up delay-1">
        {MOCK_HISTORY.map((h, i) => (
          <button
            key={i}
            onClick={() => setSelectedIdx(i)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${selectedIdx === i
                ? 'bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/30'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#7C3AED] hover:text-[#7C3AED]'
              }`}
          >
            {MONTH_NAMES[h.month]} {h.year}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="הכנסות"
          amount={summary.totalIncome}
          icon="💰"
          color="#059669"
          bgColor="#D1FAE5"
          subtitle={incDelta !== null ? `${incDelta > 0 ? '+' : ''}${incDelta.toFixed(0)}% מהחודש הקודם` : 'החודש הראשון'}
          delay={0}
        />
        <StatCard
          title="הוצאות חודשיות"
          amount={summary.totalMonthlyExpenses}
          icon="🛒"
          color="#7C3AED"
          bgColor="#EDE9FE"
          subtitle={expDelta !== null ? `${expDelta > 0 ? '+' : ''}${expDelta.toFixed(0)}% מהחודש הקודם` : undefined}
          delay={50}
        />
        <StatCard
          title="הוצאות קבועות"
          amount={summary.totalFixedExpenses}
          icon="🏠"
          color="#D97706"
          bgColor="#FEF3C7"
          delay={100}
        />
        <StatCard
          title="חסכון"
          amount={summary.totalInvestments}
          icon="📈"
          color="#0EA5E9"
          bgColor="#E0F2FE"
          delay={150}
        />
      </div>

      {/* Bar chart */}
      <div className="mb-6 fade-up delay-3">
        <MonthlyBarChart history={MOCK_HISTORY} />
      </div>

      {/* Pie + transactions */}
      <div className="grid md:grid-cols-2 gap-6">
        <CategoryPieChart summary={summary} />
        <TransactionList transactions={summary.transactions} limit={10} />
      </div>
    </div>
  );
}
