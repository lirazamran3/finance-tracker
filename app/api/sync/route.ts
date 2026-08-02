import { NextRequest, NextResponse } from 'next/server';
import { CompanyTypes } from 'israeli-bank-scrapers';

// israeli-bank-scrapers runs in Node.js (not Edge runtime)
// This route scrapes bank data and returns transactions

export async function POST(req: NextRequest) {
  const config = await req.json();

  try {
    const { createScraper } = await import('israeli-bank-scrapers');

    const results: any[] = [];

    // Scrape Discount Bank
    if (config.discountUser && config.discountPass) {
      const scraper = createScraper({
        companyId: CompanyTypes.discount,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
        combineInstallments: false,
        showBrowser: false,
      });

      const result = await scraper.scrape({
        userCode: config.discountId,
        password: config.discountPass,
      });

      if (result.success && result.accounts) {
        result.accounts.forEach((account: any) => {
          account.txns?.forEach((txn: any) => {
            results.push({
              id: `dc-${txn.identifier || Date.now()}`,
              date: txn.date,
              amount: Math.abs(txn.chargedAmount),
              description: txn.description,
              category: 'אחר',
              type: txn.chargedAmount > 0 ? 'income' : 'expense',
              isFixed: false,
              source: 'bank',
            });
          });
        });
      }
    }

    // Scrape Isracard
    if (config.israelcardUser && config.israelcardPass) {
      const scraper = createScraper({
        companyId: CompanyTypes.isracard,
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
        combineInstallments: false,
        showBrowser: false,
      });

      const result = await scraper.scrape({
        id: config.israelcardId,
        password: config.israelcardPass,
        card6Digits: config.israelcardUser,
      });

      if (result.success && result.accounts) {
        result.accounts.forEach((account: any) => {
          account.txns?.forEach((txn: any) => {
            results.push({
              id: `ic-${txn.identifier || Date.now()}`,
              date: txn.date,
              amount: Math.abs(txn.chargedAmount),
              description: txn.description,
              category: 'אחר',
              type: 'expense',
              isFixed: false,
              source: 'credit',
            });
          });
        });
      }
    }

    // Auto-categorize with Claude if API key is set
    if (process.env.ANTHROPIC_API_KEY && results.length > 0) {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const descriptions = results.map((t, i) => `${i}: ${t.description} (₪${t.amount})`).join('\n');
      const CATEGORIES = ['מזון ומסעדות','תחבורה','בילויים','קניות','חשבונות וקבועים','בריאות','השקעות וחסכון','שכר והכנסות','אחר'];

      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `קטלג כל עסקה לאחת מהקטגוריות: ${CATEGORIES.join(', ')}\n\nעסקאות:\n${descriptions}\n\nהחזר JSON מערך של קטגוריות בלבד לפי סדר המספרים: ["קטגוריה1","קטגוריה2",...]`,
        }],
      });

      try {
        const text = msg.content[0].type === 'text' ? msg.content[0].text : '[]';
        const cats: string[] = JSON.parse(text);
        cats.forEach((cat, i) => {
          if (results[i] && CATEGORIES.includes(cat)) {
            results[i].category = cat;
          }
        });
      } catch { /* keep 'אחר' as fallback */ }
    }

    return NextResponse.json({ transactions: results, count: results.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
