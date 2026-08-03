import { Category } from './types';

export const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  'מזון מהבית':              { color: '#F97316', bg: '#FFF7ED', icon: '🛒' },
  'אוכל בחוץ':               { color: '#EF4444', bg: '#FEF2F2', icon: '🍽️' },
  'רכב':                     { color: '#3B82F6', bg: '#EFF6FF', icon: '🚗' },
  'תחבורה ציבורית':          { color: '#6366F1', bg: '#EEF2FF', icon: '🚌' },
  'ביגוד והנעלה':            { color: '#EC4899', bg: '#FDF2F8', icon: '👗' },
  'קניות אונליין':            { color: '#8B5CF6', bg: '#F5F3FF', icon: '📦' },
  'קניות לבית':               { color: '#D97706', bg: '#FFFBEB', icon: '🏠' },
  'מוצרי חשמל וטכנולוגיה':   { color: '#0EA5E9', bg: '#F0F9FF', icon: '💻' },
  'בריאות ורפואה':            { color: '#EF4444', bg: '#FEF2F2', icon: '💊' },
  'קוסמטיקה וטיפוח':         { color: '#F472B6', bg: '#FDF2F8', icon: '💄' },
  'ספורט וכושר':              { color: '#10B981', bg: '#ECFDF5', icon: '🏋️' },
  'בילויים ופנאי':            { color: '#A855F7', bg: '#FAF5FF', icon: '🎭' },
  'חינוך וקורסים':            { color: '#14B8A6', bg: '#F0FDFA', icon: '📚' },
  'חשבונות ותשלומים':        { color: '#F59E0B', bg: '#FFFBEB', icon: '📄' },
  'ביטוחים':                  { color: '#64748B', bg: '#F8FAFC', icon: '🛡️' },
  'נסיעות וחופשות':           { color: '#06B6D4', bg: '#ECFEFF', icon: '✈️' },
  'מתנות ותרומות':            { color: '#F43F5E', bg: '#FFF1F2', icon: '🎁' },
  'השקעות וחסכון':            { color: '#0EA5E9', bg: '#F0F9FF', icon: '📈' },
  'שכר והכנסות':              { color: '#059669', bg: '#ECFDF5', icon: '💰' },
  'אחר':                      { color: '#94A3B8', bg: '#F8FAFC', icon: '📌' },
};

export const ALL_CATEGORIES: Category[] = Object.keys(CATEGORY_CONFIG) as Category[];

export const EXPENSE_CATEGORIES: Category[] = [
  'מזון מהבית', 'אוכל בחוץ', 'רכב', 'תחבורה ציבורית',
  'ביגוד והנעלה', 'קניות אונליין', 'קניות לבית', 'מוצרי חשמל וטכנולוגיה',
  'בריאות ורפואה', 'קוסמטיקה וטיפוח', 'ספורט וכושר', 'בילויים ופנאי',
  'חינוך וקורסים', 'חשבונות ותשלומים', 'ביטוחים', 'נסיעות וחופשות',
  'מתנות ותרומות', 'אחר',
];

export const FIXED_CATEGORIES: Category[] = ['חשבונות ותשלומים', 'ביטוחים'];
export const INCOME_CATEGORIES: Category[] = ['שכר והכנסות'];
export const INVESTMENT_CATEGORIES: Category[] = ['השקעות וחסכון'];

export function getCategoryColor(category: Category): string {
  return CATEGORY_CONFIG[category]?.color ?? '#94A3B8';
}

// Auto-categorization by known merchant keywords
export const MERCHANT_CATEGORY_MAP: Record<string, Category> = {
  'PILATES': 'ספורט וכושר',
  'FREE-FIT': 'ספורט וכושר',
  'GYM': 'ספורט וכושר',
  'FITNESS': 'ספורט וכושר',
  'ביטוח ישיר': 'ביטוחים',
  'מועדון ביטוח': 'ביטוחים',
  'ביטוח': 'ביטוחים',
  'סופר פארם': 'קוסמטיקה וטיפוח',
  'SUPER-PHARM': 'קוסמטיקה וטיפוח',
  'SHEIN': 'קניות אונליין',
  'AMAZON': 'קניות אונליין',
  'ALIEXPRESS': 'קניות אונליין',
  'ZARA': 'ביגוד והנעלה',
  'H&M': 'ביגוד והנעלה',
  'CASTRO': 'ביגוד והנעלה',
  'GOLF': 'ביגוד והנעלה',
  'BEAUQUARTIER': 'ביגוד והנעלה',
  'סופר': 'מזון מהבית',
  'שופרסל': 'מזון מהבית',
  'רמי לוי': 'מזון מהבית',
  'מחסני': 'מזון מהבית',
  'ויקטורי': 'מזון מהבית',
  'SHUFERSAL': 'מזון מהבית',
  'מקדונלד': 'אוכל בחוץ',
  'MCDONALDS': 'אוכל בחוץ',
  'בורגר': 'אוכל בחוץ',
  'פיצה': 'אוכל בחוץ',
  'קפה': 'אוכל בחוץ',
  'COFFEE': 'אוכל בחוץ',
  'CAFE': 'אוכל בחוץ',
  'פונטביט': 'חינוך וקורסים',
  'UDEMY': 'חינוך וקורסים',
  'COURSERA': 'חינוך וקורסים',
  'בריין': 'חינוך וקורסים',
  'עיגול לטובה': 'מתנות ותרומות',
  'תרומה': 'מתנות ותרומות',
  'APPLE': 'מוצרי חשמל וטכנולוגיה',
  'GOOGLE': 'חשבונות ותשלומים',
  'NETFLIX': 'בילויים ופנאי',
  'SPOTIFY': 'בילויים ופנאי',
  'HOT': 'חשבונות ותשלומים',
  'PARTNER': 'חשבונות ותשלומים',
  'CELLCOM': 'חשבונות ותשלומים',
  'פרטנר': 'חשבונות ותשלומים',
  'סלקום': 'חשבונות ותשלומים',
  'HOT MOBILE': 'חשבונות ותשלומים',
  'דלק': 'רכב',
  'פז': 'רכב',
  'סונול': 'רכב',
  'YELLOW': 'תחבורה ציבורית',
  'GETT': 'תחבורה ציבורית',
  'UBER': 'תחבורה ציבורית',
  'REDY': 'תחבורה ציבורית',
};
