'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',          label: 'לוח בקרה',  icon: '📊' },
  { href: '/history',   label: 'היסטוריה',  icon: '📅' },
  { href: '/tips',      label: 'טיפים',     icon: '💡' },
  { href: '/settings',  label: 'הגדרות',    icon: '⚙️' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-l border-[#E5E7EB] py-8 px-4 gap-2 shrink-0">
        <div className="mb-6 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white text-lg mb-3">
            ₪
          </div>
          <h1 className="text-[15px] font-bold text-[#1E1B4B]">ניהול כספים</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">לירז ויובל</p>
        </div>

        {NAV.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${active
                  ? 'bg-[#EDE9FE] text-[#7C3AED]'
                  : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#1E1B4B]'
                }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 right-0 left-0 bg-white border-t border-[#E5E7EB] flex z-50">
        {NAV.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors
                ${active ? 'text-[#7C3AED]' : 'text-[#9CA3AF]'}`}
            >
              <span className="text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
