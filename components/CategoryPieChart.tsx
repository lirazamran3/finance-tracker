'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlySummary } from '@/lib/types';

interface Props {
  summary: MonthlySummary;
}

function formatILS(n: number) {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0];
    return (
      <div className="card px-4 py-3 text-sm shadow-lg">
        <p className="font-semibold text-[#1E1B4B]">{d.name}</p>
        <p className="text-[#6B7280] mt-0.5">{formatILS(d.value)}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ summary }: Props) {
  const data = summary.categoryBreakdown
    .filter(c => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const total = data.reduce((s, c) => s + c.amount, 0);

  return (
    <div className="card p-5 fade-up delay-4">
      <h3 className="text-sm font-semibold text-[#1E1B4B] mb-4">הוצאות לפי קטגוריה</h3>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 flex flex-col gap-2 w-full">
          {data.map((c) => (
            <div key={c.category} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-sm text-[#374151] truncate">{c.category}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(c.amount / total) * 100}%`, background: c.color }}
                  />
                </div>
                <span className="text-xs font-medium text-[#6B7280] w-16 text-left">{formatILS(c.amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}