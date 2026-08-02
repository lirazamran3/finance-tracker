'use client';

import { Transaction } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/categories';
import { useState } from 'react';

interface Props {
  transactions: Transaction[];
  limit?: number;
}

function formatILS(n: number) {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

export default function TransactionList({ transactions, limit }: Props) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const shown = (limit && !showAll) ? sorted.slice(0, limit) : sorted;

  return (
    <div className="card p-5 fade-up delay-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#1E1B4B]">עסקאות אחרונות</h3>
        <span className="text-xs text-[#9CA3AF]">{transactions.length} עסקאות</span>
      </div>

      <div className="flex flex-col divide-y divide-[#F3F4F6]">
        {shown.map((t) => {
          const cfg = CATEGORY_CONFIG[t.category];
          const isIncome = t.type === 'income';
          const isInvest = t.type === 'investment';
          return (
            <div key={t.id} className="flex items-center gap-3 py-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                style={{ background: cfg?.bg }}
              >
                {cfg?.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1E1B4B] truncate">{t.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="tag text-xs"
                    style={{ background: cfg?.bg, color: cfg?.color }}
                  >
                    {t.category}
                  </span>
                  {t.isFixed && (
                    <span className="text-xs text-[#9CA3AF]">קבועה</span>
                  )}
                </div>
              </div>

              <div className="text-left shrink-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: isIncome ? '#059669' : isInvest ? '#0EA5E9' : '#EF4444' }}
                >
                  {isIncome || isInvest ? '+' : '-'}{formatILS(t.amount)}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{formatDate(t.date)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {limit && sorted.length > limit && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="w-full mt-3 py-2 text-sm text-[#7C3AED] font-medium hover:bg-[#EDE9FE] rounded-xl transition-colors"
        >
          {showAll ? 'הצג פחות' : `הצג עוד ${sorted.length - limit} עסקאות`}
        </button>
      )}
    </div>
  );
}
