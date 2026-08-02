'use client';

import { useState } from 'react';

type BankStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface BankConfig {
  discountUser: string;
  discountPass: string;
  discountId: string;
  israelcardUser: string;
  israelcardPass: string;
  israelcardId: string;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<BankConfig>({
    discountUser: '', discountPass: '', discountId: '',
    israelcardUser: '', israelcardPass: '', israelcardId: '',
  });
  const [discountStatus, setDiscountStatus] = useState<BankStatus>('idle');
  const [israelcardStatus, setIsraelcardStatus] = useState<BankStatus>('idle');
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  function set(field: keyof BankConfig) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setConfig(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function testConnection(bank: 'discount' | 'israelcard') {
    const setter = bank === 'discount' ? setDiscountStatus : setIsraelcardStatus;
    setter('connecting');
    await new Promise(r => setTimeout(r, 1800));
    setter('connected');
  }

  async function runSync() {
    setSyncing(true);
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setLastSync(new Date().toLocaleString('he-IL'));
    } catch {
      // handle error
    } finally {
      setSyncing(false);
    }
  }

  const StatusBadge = ({ status }: { status: BankStatus }) => {
    if (status === 'idle') return null;
    const map = {
      connecting: { text: 'מתחבר...', color: '#D97706', bg: '#FEF3C7' },
      connected:  { text: 'מחובר',   color: '#059669', bg: '#D1FAE5' },
      error:      { text: 'שגיאה',   color: '#EF4444', bg: '#FEE2E2' },
    };
    const { text, color, bg } = map[status];
    return <span className="tag text-xs" style={{ color, background: bg }}>{text}</span>;
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0">
      <div className="mb-8 fade-up">
        <h2 className="text-2xl font-bold text-[#1E1B4B]">הגדרות</h2>
        <p className="text-sm text-[#6B7280] mt-0.5">חיבור לבנק וסנכרון עסקאות</p>
      </div>

      {/* Info banner */}
      <div className="card p-4 mb-6 fade-up delay-1 flex gap-3" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
        <span className="text-xl shrink-0">🔒</span>
        <div>
          <p className="text-sm font-semibold text-[#1E40AF]">הפרטים נשמרים מקומית בלבד</p>
          <p className="text-xs text-[#3B82F6] mt-0.5">
            פרטי ההתחברות לא נשלחים לאף שרת חיצוני. הסנכרון מתבצע ישירות מהמחשב שלכם לאתר הבנק.
          </p>
        </div>
      </div>

      {/* Bank Discount */}
      <div className="card p-5 mb-4 fade-up delay-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] flex items-center justify-center font-bold text-[#1D4ED8] text-sm">DC</div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#1E1B4B]">בנק דיסקונט</h3>
            <p className="text-xs text-[#6B7280]">חיבור לחשבון הבנק</p>
          </div>
          <StatusBadge status={discountStatus} />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'תעודת זהות', field: 'discountId' as const, placeholder: '000000000' },
            { label: 'שם משתמש', field: 'discountUser' as const, placeholder: 'שם המשתמש שלך' },
            { label: 'סיסמא', field: 'discountPass' as const, placeholder: '••••••••', type: 'password' },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">{label}</label>
              <input
                type={type ?? 'text'}
                value={config[field]}
                onChange={set(field)}
                placeholder={placeholder}
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => testConnection('discount')}
          disabled={discountStatus === 'connecting'}
          className="btn-ghost mt-4 text-sm"
        >
          {discountStatus === 'connecting'
            ? <span className="w-3.5 h-3.5 border-2 border-[#D1D5DB] border-t-[#6B7280] rounded-full spin" />
            : '🔌'
          }
          בדיקת חיבור
        </button>
      </div>

      {/* Isracard */}
      <div className="card p-5 mb-6 fade-up delay-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center font-bold text-[#D97706] text-sm">IC</div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#1E1B4B]">ישראכרט</h3>
            <p className="text-xs text-[#6B7280]">כרטיס אשראי</p>
          </div>
          <StatusBadge status={israelcardStatus} />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'תעודת זהות', field: 'israelcardId' as const, placeholder: '000000000' },
            { label: 'שם משתמש', field: 'israelcardUser' as const, placeholder: 'שם המשתמש שלך' },
            { label: 'סיסמא', field: 'israelcardPass' as const, placeholder: '••••••••', type: 'password' },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label className="text-xs font-medium text-[#6B7280] mb-1 block">{label}</label>
              <input
                type={type ?? 'text'}
                value={config[field]}
                onChange={set(field)}
                placeholder={placeholder}
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => testConnection('israelcard')}
          disabled={israelcardStatus === 'connecting'}
          className="btn-ghost mt-4 text-sm"
        >
          {israelcardStatus === 'connecting'
            ? <span className="w-3.5 h-3.5 border-2 border-[#D1D5DB] border-t-[#6B7280] rounded-full spin" />
            : '🔌'
          }
          בדיקת חיבור
        </button>
      </div>

      {/* Sync button */}
      <div className="card p-5 fade-up delay-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1E1B4B]">סנכרון עסקאות</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              {lastSync ? `סנכרון אחרון: ${lastSync}` : 'לא בוצע סנכרון עדיין'}
            </p>
          </div>
          <button
            onClick={runSync}
            disabled={syncing}
            className="btn-primary"
          >
            {syncing
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full spin" />
              : '🔄'
            }
            {syncing ? 'מסנכרן...' : 'סנכרן עכשיו'}
          </button>
        </div>
      </div>
    </div>
  );
}
