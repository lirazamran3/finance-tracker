import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync(new URL('../bank-credentials.env', import.meta.url), 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => l.split('='))
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

// Delete only scraped (non-manual) transactions before July 2026
const { error: e1, count: c1 } = await supabase
  .from('transactions')
  .delete({ count: 'exact' })
  .lt('year', 2026)
  .in('source', ['bank', 'credit']);

const { error: e2, count: c2 } = await supabase
  .from('transactions')
  .delete({ count: 'exact' })
  .eq('year', 2026)
  .lt('month', 7)
  .in('source', ['bank', 'credit']);

if (e1 || e2) console.error('שגיאה:', e1 || e2);
else console.log(`נמחקו ${(c1 || 0) + (c2 || 0)} עסקאות ישנות`);
