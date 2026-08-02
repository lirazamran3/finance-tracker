'use client';

interface StatCardProps {
  title: string;
  amount: number;
  icon: string;
  color: string;
  bgColor: string;
  subtitle?: string;
  delay?: number;
  onClick?: () => void;
}

function formatILS(n: number) {
  return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(n);
}

export default function StatCard({ title, amount, icon, color, bgColor, subtitle, delay = 0, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className="card card-hover p-5 flex flex-col gap-3 fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#6B7280]">{title}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: bgColor }}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color }}>{formatILS(amount)}</p>
        {subtitle && <p className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}