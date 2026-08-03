'use client';

import { Transaction } from '@/lib/types';
import { CATEGORY_CONFIG, ALL_CATEGORIES } from '@/lib/categories';
import { useState, useRef, useEffect } from 'react';

interface Props {
  transactions: Transaction[];
  limit?: number;
  onUpdateCategory?: (id: string, category: string) => void;
}

function formatILS(n: number) {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

function CategoryPicker({ category, onSelect }: { category: string; onSelect: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const cfg = CATEGORY_CONFIG[category];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="tag text-xs cursor-pointer hover:opacity-80 transition-opacity"
        style={{ background: cfg?.bg ?? '#F8FAFC', color: cfg?.color ?? '#94A3B8' }}
        title="לחצי לשינוי קטגוריה"
      >
        {cfg?.icon ?? '📌'} {category} ✏️
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl z-50 w-56 max-h-72 overflow-y-auto p-2">
          {ALL_CATEGORIES.map(c => {
            const cc = CATEGORY_CONFIG[c];
            return (
              <button
                key={c}
                onClick={() => { onSelect(c); setOpen(false); }}
                className={`w-full text-right px-3 py-2 rounded-xl text-xs hover:bg-[#F3F4F6] flex items-center gap-2 transition-colors ${c === category ? 'bg-[#EDE9FE] font-semibold' : ''}`}
              >
                <span>{cc?.icon}</span>
                <span>{c}</span>
              </button>
            );
          })}
          <div className="border-t border-[#F3F4F6] mt-1 pt-1">
            <div className="flex gap-1 px-1">
              <input
                value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder="קטגוריה מותאמת..."
                className="flex-1 text-xs border border-[#E5E7EB] rounded-lg px-2 py-1.5 outline-none focus:border-[#7C3AED]"
                onKeyDown={e => { if (e.key === 'Enter' && custom.trim()) { onSelect(custom.trim()); setOpen(false); } }}
              />
              <button
                onClick={() => { if (custom.trim()) { onSelect(custom.trim()); setOpen(false); } }}
                className="text-xs px-2 py-1.5 bg-[#7C3AED] text-white rounded-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransactionList({ transactions, limit, onUpdateCategory }: Props) {
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
                style={{ background: cfg?.bg ?? '#F8FAFC' }}
              >
                {cfg?.icon ?? '📌'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1E1B4B] truncate">{t.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {onUpdateCategory ? (
                    <CategoryPicker
                      category={t.category}
                      onSelect={cat => onUpdateCategory(t.id, cat)}
                    />
                  ) : (
                    <span className="tag text-xs" style={{ background: cfg?.bg, color: cfg?.color }}>
                      {t.category}
                    </span>
                  )}
                  {t.isFixed && <span className="text-xs text-[#9CA3AF]">קבועה</span>}
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
