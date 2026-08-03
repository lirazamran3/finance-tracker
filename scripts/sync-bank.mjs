import { createClient } from '@supabase/supabase-js';
import { createScraper, CompanyTypes } from 'israeli-bank-scrapers';
import Anthropic from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CATEGORIES = [
  'מזון מהבית','אוכל בחוץ','רכב','תחבורה ציבורית',
  'ביגוד והנעלה','קניות אונליין','קניות לבית','מוצרי חשמל וטכנולוגיה',
  'בריאות ורפואה','קוסמטיקה וטיפוח','ספורט וכושר','בילויים ופנאי',
  'חינוך וקורסים','חשבונות ותשלומים','ביטוחים','נסיעות וחופשות',
  'מתנות ותרומות','השקעות וחסכון','שכר והכנסות','אחר'
];

const MERCHANT_MAP = {
  'PILATES':'ספורט וכושר','FREE-FIT':'ספורט וכושר','GYM':'ספורט וכושר','FITNESS':'ספורט וכושר',
  'ביטוח ישיר':'ביטוחים','מועדון ביטוח':'ביטוחים','ביטוח':'ביטוחים',
  'סופר פארם':'קוסמטיקה וטיפוח','SUPER-PHARM':'קוסמטיקה וטיפוח',
  'SHEIN':'קניות אונליין','AMAZON':'קניות אונליין','ALIEXPRESS':'קניות אונליין',
  'ZARA':'ביגוד והנעלה','BEAUQUARTIER':'ביגוד והנעלה','CASTRO':'ביגוד והנעלה',
  'שופרסל':'מזון מהבית','רמי לוי':'מזון מהבית','מחסני':'מזון מהבית','ויקטורי':'מזון מהבית','סופר':'מזון מהבית',
  'מקדונלד':'אוכל בחוץ','בורגר':'אוכל בחוץ','פיצה':'אוכל בחוץ','קפה':'אוכל בחוץ','COFFEE':'אוכל בחוץ','CAFE':'אוכל בחוץ',
  'פונטביט':'חינוך וקורסים','בריין':'חינוך וקורסים','UDEMY':'חינוך וקורסים',
  'עיגול לטובה':'מתנות ותרומות','תרומה':'מתנות ותרומות',
  'NETFLIX':'בילויים ופנאי','SPOTIFY':'בילויים ופנאי',
  'GOOGLE':'חשבונות ותשלומים','HOT':'חשבונות ותשלומים','פרטנר':'חשבונות ותשלומים','סלקום':'חשבונות ותשלומים',
  'דלק':'רכב','פז':'רכב','סונול':'רכב',
  'GETT':'תחבורה ציבורית','UBER':'תחבורה ציבורית','YELLOW':'תחבורה ציבורית',
};

function autoCategory(description) {
  const upper = description.toUpperCase();
  for (const [keyword, cat] of Object.entries(MERCHANT_MAP)) {
    if (upper.includes(keyword.toUpperCase())) return cat;
  }
  return null;
}
const START_DATE = new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1);

const BROWSER_ARGS = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'];

const results = [];

// Discount Bank
if (process.env.DISCOUNT_USER && process.env.DISCOUNT_PASS) {
  console.log('סורק בנק דיסקונט...');
  const browser = await puppeteer.launch({ headless: true, args: BROWSER_ARGS });
  try {
    const scraper = createScraper({
      companyId: CompanyTypes.discount,
      startDate: START_DATE,
      combineInstallments: false,
      showBrowser: false,
      browser,
    });
    const result = await scraper.scrape({
      userCode: process.env.DISCOUNT_USER,
      password: process.env.DISCOUNT_PASS,
    });
    if (result.success && result.accounts) {
      result.accounts.forEach(account => {
        account.txns?.forEach(txn => {
          results.push({
            id: `dc-${txn.identifier || txn.date + txn.chargedAmount}`,
            date: txn.date,
            amount: Math.abs(txn.chargedAmount),
            description: txn.description,
            category: 'אחר',
            type: txn.chargedAmount > 0 ? 'income' : 'expense',
            is_fixed: false,
            source: 'bank',
          });
        });
      });
      console.log(`דיסקונט: ${results.length} עסקאות`);
    } else {
      console.error('דיסקונט נכשל:', result.errorMessage);
      console.error('דיסקונט תוצאה מלאה:', JSON.stringify(result, null, 2));
    }
  } catch (e) {
    console.error('שגיאה בדיסקונט:', e.message);
    console.error('Stack:', e.stack);
  } finally {
    await browser.close();
  }
}

// Isracard
if (process.env.ISRACARD_ID && process.env.ISRACARD_PASS && process.env.ISRACARD_CARD6) {
  console.log('סורק ישראכרט...');
  const countBefore = results.length;
  const browser = await puppeteer.launch({ headless: true, args: BROWSER_ARGS });
  try {
    const scraper = createScraper({
      companyId: CompanyTypes.isracard,
      startDate: START_DATE,
      combineInstallments: false,
      showBrowser: false,
      browser,
    });
    const result = await scraper.scrape({
      id: process.env.ISRACARD_ID,
      password: process.env.ISRACARD_PASS,
      card6Digits: process.env.ISRACARD_CARD6,
    });
    if (result.success && result.accounts) {
      result.accounts.forEach(account => {
        account.txns?.forEach(txn => {
          const billingDate = txn.processedDate || txn.date;
          results.push({
            id: `ic-${txn.identifier || txn.date + txn.chargedAmount}`,
            date: billingDate,
            amount: Math.abs(txn.chargedAmount),
            description: txn.description,
            category: 'אחר',
            type: txn.chargedAmount > 0 ? 'income' : 'expense',
            is_fixed: false,
            source: 'credit',
          });
        });
      });
      console.log(`ישראכרט: ${results.length - countBefore} עסקאות`);
    } else {
      console.error('ישראכרט נכשל:', result.errorMessage);
      console.error('ישראכרט תוצאה מלאה:', JSON.stringify(result, null, 2));
    }
  } catch (e) {
    console.error('שגיאה בישראכרט:', e.message);
    console.error('Stack:', e.stack);
  } finally {
    await browser.close();
  }
}

// Step 1: auto-categorize by merchant map
results.forEach(t => {
  const cat = autoCategory(t.description);
  if (cat) t.category = cat;
});

// Step 2: send uncategorized to Claude
const uncategorized = results.filter(t => t.category === 'אחר');
if (process.env.ANTHROPIC_API_KEY && uncategorized.length > 0) {
  console.log(`מקטלג ${uncategorized.length} עסקאות עם Claude...`);
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const descriptions = uncategorized.map((t, i) => `${i}: ${t.description} (₪${t.amount})`).join('\n');
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `קטלג כל עסקה לאחת מהקטגוריות: ${CATEGORIES.join(', ')}\n\nעסקאות:\n${descriptions}\n\nהחזר JSON מערך של קטגוריות בלבד לפי סדר: ["קטגוריה1","קטגוריה2",...]`,
      }],
    });
    const text = msg.content[0].type === 'text' ? msg.content[0].text : '[]';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const cats = JSON.parse(jsonMatch ? jsonMatch[0] : '[]');
    cats.forEach((cat, i) => {
      if (uncategorized[i] && CATEGORIES.includes(cat)) uncategorized[i].category = cat;
    });
    console.log('קיטלוג הושלם');
  } catch (e) {
    console.error('שגיאה בקיטלוג:', e.message);
  }
}

// Save to Supabase
if (results.length > 0) {
  console.log(`שומר ${results.length} עסקאות ל-Supabase...`);
  const rows = results.map(t => ({
    ...t,
    month: new Date(t.date).getMonth() + 1,
    year: new Date(t.date).getFullYear(),
  }));

  const { error } = await supabase.from('transactions').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('שגיאה בשמירה:', error.message);
    process.exit(1);
  }
  console.log(`✓ ${results.length} עסקאות נשמרו בהצלחה`);
} else {
  console.log('לא נמצאו עסקאות חדשות');
}
