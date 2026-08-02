'use client';

import { useState } from 'react';
import { Transaction, TransactionType, Category } from '@/lib/types';
import { CATEGORY_CONFIG, EXPENSE_CATEGORIES, INCOME_CATEGORIES, INVESTMENT_CATEGORIES, FIXED_CATEGORIES } from '@/lib/categories';

interface DrawerConfig {
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  filterFn: (t: Transaction) => boolean;
  defaultType: TransactionType;
  defaultFixed: boolean;
}

interface Props {
  config: DrawerConfig;
  transactions: Transaction[];
  onClose: () => void;
  onAdd: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

function formatILS(n: number) {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

export default function TransactionDrawer({ config, transactions, onClose, onAdd, onDelete }: Props) {
  const filtered = transactions
    .filter(config.filterFn)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = filtered.reduce((s, t) => s + t.amount, 0);

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>(
    config.defaultType === 'income' ? 'שכר והכנסות' :
    config.defaultType === 'investment' ? 'השקעות וחסכון' :
    config.defaultFixed ? 'חשבונות וקבועים' : 'מזון ומסעדות'
  );
  const [showForm, setShowForm] = useState(false);

  const categories =
    config.defaultType === 'income'     ? INCOME_CATEGORIES :
    config.defaultType === 'investment' ? INVESTMENT_CATEGORIES :
    config.defaultFixed                 ? FIXED_CATEGORIES : EXPENSE_CATEGORIES;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!desc || !amount) return;
    onAdd({
      id: Date.now().toString(),
      date,
      amount: parseFloat(amount),
      description: desc,
      category,
      type: config.defaultType,
      isFixed: config.defaultFixed,
      source: 'manual',
    });
    setDesc(''); setAmount(''); setShowForm(false);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
        style={{ animation: 'slideIn 0.25s ease' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-[#F3F4F6]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: config.bgColor }}
          >
            {config.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-base font-bold text-[#1E1B4B]">{config.title}</h2>
            <p className="text-sm font-semibold mt-0.5" style={{ color: config.color }}>
              {formatILS(total)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF]"
          >
            ✕
          </button>
        </div>

        {/* Add button */}
        <div className="px-5 pt-4 pb-2">
          <button
            onClick={() => setShowForm(v => !v)}
            className="btn-primary w-full justify-center"
          >
            <span className="text-lg leading-none">+</span>
            {showForm ? 'ביטול' : 'הוספת עסקה'}
          </button>
        </div>

        {/* Inline form */}
        {showForm && (
          <form onSubmit={handleAdd} className="px-5 py-3 bg-[#F9FAFB] mx-5 rounded-2xl mb-2 flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">תיאור</label>
              <input
                required autoFocus
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="שם העסקה..."
                className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE]"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-medium text-[#6B7280] mb-1 block">סכום (₪)</label>
                <input
                  required type="number" min="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-[#6B7280] mb-1 block">תאריך</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">קטגוריה</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm outline-none focus:border-[#7C3AED] bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary justify-center w-full">הוספה</button>
          </form>
        )}

        {/* Transactions list */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#9CA3AF] text-sm gap-2">
              <span className="text-3xl">📭</span>
              אין עסקאות עדיין
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#F3F4F6]">
              {filtered.map(t => {
                const cfg = CATEGORY_CONFIG[t.category];
                const isIncome = t.type === 'income';
                const isInvest = t.type === 'investment';
                return (
                  <div key={t.id} className="flex items-center gap-3 py-3 group">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                      style={{ background: cfg?.bg }}
                    >
                      {cfg?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E1B4B] truncate">{t.description}</p>
                      <p className="text-xs text-[#9CA3AF]">{formatDate(t.date)}</p>
                    </div>
                    <span
                      className="text-sm font-semibold shrink-0"
                      style={{ color: isIncome ? '#059669' : isInvest ? '#0EA5E9' : '#EF4444' }}
                    >
                      {isIncome || isInvest ? '+' : '-'}{formatILS(t.amount)}
                    </span>
                    <button
                      onClick={() => onDelete(t.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#EF4444] text-xs shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

export type { DrawerConfig };
