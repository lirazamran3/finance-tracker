import { Category } from './types';

export const CATEGORY_CONFIG: Record<Category, { color: string; bg: string; icon: string }> = {
  'מזון ומסעדות':     { color: '#F97316', bg: '#FFF7ED', icon: '🍽️' },
  'תחבורה':           { color: '#3B82F6', bg: '#EFF6FF', icon: '🚗' },
  'בילויים':          { color: '#A855F7', bg: '#FAF5FF', icon: '🎭' },
  'קניות':            { color: '#EC4899', bg: '#FDF2F8', icon: '🛍️' },
  'חשבונות וקבועים': { color: '#F59E0B', bg: '#FFFBEB', icon: '🏠' },
  'בריאות':           { color: '#EF4444', bg: '#FEF2F2', icon: '💊' },
  'השקעות וחסכון':    { color: '#0EA5E9', bg: '#F0F9FF', icon: '📈' },
  'שכר והכנסות':      { color: '#10B981', bg: '#ECFDF5', icon: '💰' },
  'אחר':              { color: '#94A3B8', bg: '#F8FAFC', icon: '📌' },
};

export const EXPENSE_CATEGORIES: Category[] = [
  'מזון ומסעדות',
  'תחבורה',
  'בילויים',
  'קניות',
  'חשבונות וקבועים',
  'בריאות',
  'אחר',
];

export const FIXED_CATEGORIES: Category[] = ['חשבונות וקבועים'];
export const INCOME_CATEGORIES: Category[] = ['שכר והכנסות'];
export const INVESTMENT_CATEGORIES: Category[] = ['השקעות וחסכון'];

export function getCategoryColor(category: Category): string {
  return CATEGORY_CONFIG[category]?.color ?? '#94A3B8';
}