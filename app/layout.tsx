import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'ניהול כספים',
  description: 'מעקב חכם אחרי ההוצאות וההכנסות שלכם',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 min-h-screen overflow-auto p-6 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}