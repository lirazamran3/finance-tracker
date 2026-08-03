'use client';

import { useState } from 'react';
import { useTransactions } from '@/lib/useTransactions';

export default function TipsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const { summary: curr } = useTransactions(month, year);
  const { summary: prev } = useTransactions(prevMonth, prevYear);

  const [loading, setLoading] = useState(false);
  const [aiTips, setAiTips] = useState<null | { icon: string; title: string; body: string; tag: string; tagColor: string; tagBg: string; saving: number }[]>(null);

  const totalExp = curr.totalMonthlyExpenses + curr.totalFixedExpenses;
  const prevExp = prev.totalMonthlyExpenses + prev.totalFixedExpenses;
  const expChange = prevExp > 0 ? Math.round(((totalExp - prevExp) / prevExp) * 100) : 0;

  async function generateAiTips() {
    setLoading(true);
    try {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: curr }),
      });
      const data = await res.json();
      if (data.tips) setAiTips(data.tips);
    } catch {
      // keep static tips
    } finally {
      setLoading(false);
    }
  }

  const monthName = new Date(year, month - 1).toLocaleDateString('he-IL', { month: 'long' });

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-0">
      <div className="flex items-start justify-between mb-8 fade-up">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B4B]">טיפים</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">מבוסס על {monthName} {year}</p>
        </div>
        <button onClick={generateAiTips} disabled={loading} className="btn-primary">
          {loading
            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full spin" />
            : '✨'
          }
          {loading ? 'מנתח...' : 'ניתוח AI'}
        </button>
      </div>

      {/* Summary banner */}
      {totalExp > 0 && (
        <div
          className="card p-5 mb-6 fade-up delay-1 flex items-center gap-4"
          style={{ background: expChange > 5 ? '#FEF2F2' : '#ECFDF5', borderColor: expChange > 5 ? '#FCA5A5' : '#6EE7B7' }}
        >
          <div className="text-3xl">{expChange > 5 ? '⚠️' : '🎉'}</div>
          <div>
            <p className="font-semibold text-[#1E1B4B] text-sm">
              {expChange > 5
                ? `הוצאות עלו ב-${expChange}% לעומת החודש הקודם`
                : prevExp > 0
                  ? `כל הכבוד! הוצאות ירדו ב-${Math.abs(expChange)}% לעומת החודש הקודם`
                  : 'סיכום הוצאות החודש'
              }
            </p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              סה״כ הוצאות החודש:{' '}
              {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(totalExp)}
            </p>
          </div>
        </div>
      )}

      {/* AI Tips */}
      {aiTips && (
        <div className="flex flex-col gap-4">
          {aiTips.map((tip, i) => (
            <div key={i} className={`card p-5 fade-up delay-${i + 2}`}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-2xl shrink-0">
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-sm font-bold text-[#1E1B4B]">{tip.title}</h3>
                    <span className="tag text-xs" style={{ background: tip.tagBg, color: tip.tagColor }}>{tip.tag}</span>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{tip.body}</p>
                  {tip.saving > 0 && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] bg-[#D1FAE5] px-3 py-1.5 rounded-xl">
                      חיסכון פוטנציאלי: {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(tip.saving)} לחודש
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!aiTips && totalExp === 0 && (
        <div className="card p-8 text-center text-[#9CA3AF] fade-up delay-2">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-sm">אין עדיין מספיק נתונים לחודש הזה</p>
          <p className="text-xs mt-1">סנכרני את ישראכרט כדי לקבל טיפים מותאמים</p>
        </div>
      )}

      {!aiTips && totalExp > 0 && (
        <div className="card p-6 text-center fade-up delay-2">
          <p className="text-sm text-[#6B7280]">לחצי על &quot;ניתוח AI&quot; לקבלת טיפים מותאמים אישית</p>
        </div>
      )}
    </div>
  );
}
