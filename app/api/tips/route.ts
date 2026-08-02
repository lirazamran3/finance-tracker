import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const { summary } = await req.json();

  const prompt = `אתה יועץ פיננסי שמנתח הוצאות של משפחה ישראלית.

נתוני החודש:
- הכנסות: ₪${summary.totalIncome}
- הוצאות חודשיות: ₪${summary.totalMonthlyExpenses}
- הוצאות קבועות: ₪${summary.totalFixedExpenses}
- השקעות/חסכון: ₪${summary.totalInvestments}
- נשאר: ₪${summary.totalSaved}

הוצאות לפי קטגוריה:
${summary.categoryBreakdown.map((c: any) => `- ${c.category}: ₪${c.amount}`).join('\n')}

תן בדיוק 4 טיפים פרקטיים לחודש הבא בפורמט JSON הבא:
[
  {
    "icon": "אימוג'י",
    "title": "כותרת קצרה",
    "body": "הסבר מפורט של 2-3 משפטים",
    "tag": "קטגוריה",
    "tagColor": "#hexcolor",
    "tagBg": "#hexcolor",
    "saving": מספר_חיסכון_חודשי
  }
]

החזר רק JSON תקני, ללא טקסט נוסף.`;

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const tips = JSON.parse(text);
    return NextResponse.json({ tips });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to generate tips' }, { status: 500 });
  }
}
