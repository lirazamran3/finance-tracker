'use client';

import { useState, useEffect, useCallback } from 'react';
import { Category } from './types';
import { EXPENSE_CATEGORIES } from './categories';

export type BudgetMap = Partial<Record<Category, number>>;

const STORAGE_KEY = 'finance_budgets';

export function useBudget() {
  const [budgets, setBudgets] = useState<BudgetMap>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBudgets(JSON.parse(stored));
    } catch {}
  }, []);

  const setBudget = useCallback((category: Category, amount: number) => {
    setBudgets(prev => {
      const next = { ...prev, [category]: amount };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const totalBudget = EXPENSE_CATEGORIES.reduce((s, c) => s + (budgets[c] ?? 0), 0);

  return { budgets, setBudget, totalBudget };
}
