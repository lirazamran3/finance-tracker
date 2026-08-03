'use client';

import { useState } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_CONFIG } from '@/lib/categories';
import { Category } from '@/lib/types';
import { useBudget } from '@/lib/useBudget';

const fmt = (n: number) =>
  new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);

export default function BudgetPage() {
  const { budgets, setBudget, totalBudget } = useBudget();
  const [editing, setEditing] = useState<Category | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [saved, setSaved] = useState(false);

  function startEdit(cat: Category) {
    setEditing(cat);
    setInputVal(budgets[cat]?.toString() ?? '');
    setSaved(false);
  }

  function save(cat: Category) {
    const val = parseFloat(inputVal);
    if (!isNaN(val) && val >= 0) {
      setBudget(cat, val);
      setSaved(true);
      setTimeout(() => { setEditing(null); setSaved(false); }, 600);
    } else {
      setEditing(null);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0">
      <div className="mb-6 fade-up">
        <h2 className="text-2xl font-bold text-[#1E1B4B]">תקציב חודשי</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">הגדירי כמה את רוצה להוציא בכל קטגוריה</p>
      </div>

      {/* Total budget */}
      <div className="card p-5 mb-6 fade-up delay-1" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' }}>
        <p className="text-sm text-white/70 mb-1">סה״כ תקציב חודשי</p>
        <p className="text-3xl font-bold text-white">{fmt(totalBudget)}</p>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        {EXPENSE_CATEGORIES.map((cat, i) => {
          const config = CATEGORY_CONFIG[cat];
          const budget = budgets[cat] ?? 0;
          const isEditing = editing === cat;

          return (
            <div
              key={cat}
              className="card p-4 fade-up flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
              style={{ animationDelay: `${i * 30}ms` }}
              onClick={() => !isEditing && startEdit(cat)}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: config.bg }}
              >
                {config.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1E1B4B]">{cat}</p>
                {!isEditing && (
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {budget > 0 ? fmt(budget) + ' לחודש' : 'לחצי להגדרת תקציב'}
                  </p>
                )}
                {isEditing && (
                  <div className="flex items-center gap-2 mt-1" onClick={e => e.stopPropagation()}>
                    <span className="text-sm text-[#6B7280]">₪</span>
                    <input
                      autoFocus
                      type="number"
                      min="0"
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') save(cat); if (e.key === 'Escape') setEditing(null); }}
                      className="border border-[#7C3AED] rounded-lg px-3 py-1 text-sm w-28 outline-none focus:ring-2 focus:ring-[#EDE9FE]"
                      placeholder="0"
                    />
                    <button
                      onClick={() => save(cat)}
                      className="text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                      style={{ background: saved ? '#D1FAE5' : '#EDE9FE', color: saved ? '#059669' : '#7C3AED' }}
                    >
                      {saved ? 'נשמר ✓' : 'שמור'}
                    </button>
                    <button onClick={() => setEditing(null)} className="text-xs text-[#9CA3AF] hover:text-[#6B7280]">ביטול</button>
                  </div>
                )}
              </div>

              {!isEditing && budget > 0 && (
                <div className="text-sm font-bold shrink-0" style={{ color: config.color }}>
                  {fmt(budget)}
                </div>
              )}
              {!isEditing && budget === 0 && (
                <div className="text-[#D1D5DB] text-sm shrink-0">✏️</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
