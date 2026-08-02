'use client';

import { useState } from 'react';
import { MOCK_CURRENT_MONTH, MOCK_HISTORY, MONTH_NAMES } from '@/lib/mock-data';

const STATIC_TIPS = [
  {
    icon: '🍽️',
    title: 'הוצאות מזון גבוהות',
    body: 'הוצאתם ₪2,780 על מזון החודש — 17% יותר מהחודש הקודם. נסו להגדיר תקציב שבועי לסופר של ₪600 ולהגביל ארוחות בחוץ ל-4 פעמים בחודש.',
    tag: 'הוצאה',
    tagColor: '#7C3AED',
    tagBg: '#EDE9FE',
    saving: 480,
  },
  {
    icon: '📈',
    title: 'הגדילו את החסכון',
    body: 'אתם חוסכים 14% מההכנסות — טוב! היעד המומלץ הוא 20%. העברה אוטומטית של עוד ₪1,000 בתחילת חודש תקרב אתכם ליעד.',
    tag: 'חסכון',
    tagColor: '#0EA5E9',
    tagBg: '#E0F2FE',
    saving: 1000,
  },
  {
    icon: '🛍️',
    title: 'קניות אונליין',
    body: 'ₓ3 רכישות אונליין החודש בסך ₪1,180. שקלו לאמץ כלל של "המתנה 24 שעות" לפני רכישה — מפחית רכישות אימפולסיביות ב-30%.',
    tag: 'קניות',
    tagColor: '#EC4899',
    tagBg: '#FDF2F8',
    saving: 350,
  },
  {
    icon: '🏠',
    title: 'הוצאות קבועות יציבות',
    body: 'הוצאות הקבועות שלכם (₪5,550) נשארו יציבות 3 חודשים רצוף. בדקו אם יש מנויים שלא משתמשים בהם — ממוצע חיסכון פוטנציאלי: ₪120 בחודש.',
    tag: 'קבועות',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    saving: 120,
  },
];

export default function TipsPage() {
  const [loading, setLoading] = useState(false);
  const [aiTips, setAiTips] = useState<null | typeof STATIC_TIPS>(null);

  const curr = MOCK_CURRENT_MONTH;
  const prev = MOCK_HISTORY[MOCK_HISTORY.length - 2];
  const totalExp = curr.totalMonthlyExpenses + curr.totalFixedExpenses;
  const prevExp = prev ? prev.totalMonthlyExpenses + prev.totalFixedExpenses : totalExp;
  const expChange = Math.round(((totalExp - prevExp) / prevExp) * 100);

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
      // fallback to static tips
    } finally {
      setLoading(false);
    }
  }

  const displayTips = aiTips ?? STATIC_TIPS;

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-0">
      <div className="flex items-start justify-between mb-8 fade-up">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B4B]">טיפים לחודש הבא</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">
            מבוסס על {MONTH_NAMES[curr.month]} {curr.year}
          </p>
        </div>
        <button
          onClick={generateAiTips}
          disabled={loading}
          className="btn-primary"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full spin" />
            : '✨'
          }
          {loading ? 'מנתח...' : 'ניתוח AI'}
        </button>
      </div>

      {/* Summary banner */}
      <div
        className="card p-5 mb-6 fade-up delay-1 flex items-center gap-4"
        style={{ background: expChange > 5 ? '#FEF2F2' : '#ECFDF5', borderColor: expChange > 5 ? '#FCA5A5' : '#6EE7B7' }}
      >
        <div className="text-3xl">{expChange > 5 ? '⚠️' : '🎉'}</div>
        <div>
          <p className="font-semibold text-[#1E1B4B] text-sm">
            {expChange > 5
              ? `הוצאות עלו ב-${expChange}% לעומת החודש הקודם`
              : `כל הכבוד! הוצאות ירדו ב-${Math.abs(expChange)}% לעומת החודש הקודם`
            }
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">
            סה״כ הוצאות החודש:{' '}
            {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(totalExp)}
          </p>
        </div>
      </div>

      {/* Tips list */}
      <div className="flex flex-col gap-4">
        {displayTips.map((tip, i) => (
          <div key={i} className={`card p-5 fade-up delay-${i + 2}`}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F5F3FF] flex items-center justify-center text-2xl shrink-0">
                {tip.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-[#1E1B4B]">{tip.title}</h3>
                  <span className="tag text-xs" style={{ background: tip.tagBg, color: tip.tagColor }}>
                    {tip.tag}
                  </span>
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed">{tip.body}</p>
                {tip.saving > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] bg-[#D1FAE5] px-3 py-1.5 rounded-xl">
                    חיסכון פוטנציאלי:{' '}
                    {new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(tip.saving)}{' '}
                    לחודש
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!aiTips && (
        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          לחצי על &quot;ניתוח AI&quot; לקבלת טיפים מותאמים אישית על בסיס ההוצאות שלכם
        </p>
      )}
    </div>
  );
}
