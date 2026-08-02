'use client';

import { useState } from 'react';
import { Transaction, Category, TransactionType } from '@/lib/types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, INVESTMENT_CATEGORIES } from '@/lib/categories';

interface Props {
  onClose: () => void;
  onAdd: (t: Transaction) => void;
}

export default function AddTransactionModal({ onClose, onAdd }: Props) {
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('מזון ומסעדות');
  const [isFixed, setIsFixed] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income'
    ? INCOME_CATEGORIES
    : type === 'investment'
    ? INVESTMENT_CATEGORIES
    : EXPENSE_CATEGORIES;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !amount) return;
    onAdd({
      id: Date.now().toString(),
      date,
      amount: parseFloat(amount),
      description,
      category,
      type,
      isFixed,
      source: 'manual',
    });
    onClose();
  }

  const TYPE_TABS: { value: TransactionType; label: string }[] = [
    { value: 'expense',    label: 'הוצאה' },
    { value: 'income',     label: 'הכנסה' },
    { value: 'investment', label: 'השקעה / חסכון' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 fade-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-[#1E1B4B]">הוספת עסקה</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] text-lg">✕</button>
        </div>

        {/* Type tabs */}
        <div className="flex gap-1 bg-[#F3F4F6] rounded-xl p-1 mb-5">
          {TYPE_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setType(value); setCategory(
                value === 'income' ? 'שכר והכנסות' :
                value === 'investment' ? 'השקעות וחסכון' : 'מזון ומסעדות'
              ); }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors
                ${type === value ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-[#6B7280]'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">תיאור</label>
            <input
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="לדוגמה: סופר, שכירות..."
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">סכום (₪)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">תאריך</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">קטגוריה</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all bg-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {type === 'expense' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setIsFixed(v => !v)}
                className={`w-10 h-6 rounded-full transition-colors relative ${isFixed ? 'bg-[#7C3AED]' : 'bg-[#D1D5DB]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${isFixed ? 'right-1' : 'left-1'}`} />
              </div>
              <span className="text-sm text-[#374151]">הוצאה קבועה (חוזרת כל חודש)</span>
            </label>
          )}

          <button type="submit" className="btn-primary justify-center w-full mt-1">
            הוספה
          </button>
        </form>
      </div>
    </div>
  );
}
