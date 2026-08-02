'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MonthlySummary } from '@/lib/types';
import { MONTH_NAMES } from '@/lib/mock-data';

interface Props {
  history: MonthlySummary[];
}

function formatILS(n: number) {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card px-4 py-3 text-sm shadow-lg">
        <p className="font-semibold text-[#1E1B4B] mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="mt-0.5" style={{ color: p.fill }}>
            {p.name}: {formatILS(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MonthlyBarChart({ history }: Props) {
  const data = history.map(h => ({
    name: MONTH_NAMES[h.month],
    'הכנסות': h.totalIncome,
    'הוצאות': h.totalMonthlyExpenses + h.totalFixedExpenses,
    'חסכון': h.totalInvestments,
  }));

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-[#1E1B4B] mb-4">השוואה חודשית</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `₪${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F5F3FF' }} />
          <Bar dataKey="הכנסות"  fill="#D1FAE5" stroke="#059669" strokeWidth={0} radius={[6,6,0,0]} />
          <Bar dataKey="הוצאות"  fill="#EDE9FE" stroke="#7C3AED" strokeWidth={0} radius={[6,6,0,0]} />
          <Bar dataKey="חסכון"   fill="#E0F2FE" stroke="#0EA5E9" strokeWidth={0} radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex gap-4 mt-3 justify-center">
        {[
          { label: 'הכנסות', color: '#059669' },
          { label: 'הוצאות', color: '#7C3AED' },
          { label: 'חסכון',  color: '#0EA5E9' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
