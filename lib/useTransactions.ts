'use client';

import { useEffect, useState, useCallback } from 'react';
import { Transaction, MonthlySummary } from './types';
import { CATEGORY_CONFIG } from './categories';
import { MOCK_CURRENT_MONTH } from './mock-data';

function buildSummary(transactions: Transaction[], month: number, year: number): MonthlySummary {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalFixedExpenses = transactions.filter(t => t.type === 'expense' && t.isFixed).reduce((s, t) => s + t.amount, 0);
  const totalMonthlyExpenses = transactions.filter(t => t.type === 'expense' && !t.isFixed).reduce((s, t) => s + t.amount, 0);
  const totalInvestments = transactions.filter(t => t.type === 'investment').reduce((s, t) => s + t.amount, 0);

  const catMap = new Map<string, number>();
  transactions.filter(t => t.type === 'expense').forEach(t => {
    catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
  });

  return {
    month, year, transactions,
    totalIncome, totalFixedExpenses, totalMonthlyExpenses, totalInvestments,
    totalSaved: totalIncome - totalMonthlyExpenses - totalFixedExpenses - totalInvestments,
    categoryBreakdown: Array.from(catMap.entries()).map(([cat, amount]) => ({
      category: cat as any,
      amount,
      color: CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.color ?? '#94A3B8',
    })),
  };
}

export function useTransactions(month: number, year: number) {
  const [summary, setSummary] = useState<MonthlySummary>(
    month === new Date().getMonth() + 1 && year === new Date().getFullYear()
      ? MOCK_CURRENT_MONTH
      : buildSummary([], month, year)
  );
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?month=${month}&year=${year}`);
      const data = await res.json();
      if (data.transactions && data.transactions.length > 0) {
        setSummary(buildSummary(data.transactions, month, year));
        setUsingMock(false);
      }
    } catch {
      // keep mock data on error
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { load(); }, [load]);

  async function addTransaction(t: Transaction) {
    // Optimistic update
    setSummary(prev => buildSummary([...prev.transactions, t], month, year));
    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...t, is_fixed: t.isFixed }),
      });
      setUsingMock(false);
    } catch {
      // revert on error
      setSummary(prev => buildSummary(prev.transactions.filter(x => x.id !== t.id), month, year));
    }
  }

  async function deleteTransaction(id: string) {
    setSummary(prev => buildSummary(prev.transactions.filter(t => t.id !== id), month, year));
    try {
      await fetch('/api/transactions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch {
      load(); // reload on error
    }
  }

  return { summary, loading, usingMock, addTransaction, deleteTransaction, reload: load };
}
