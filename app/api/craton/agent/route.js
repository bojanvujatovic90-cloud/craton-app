export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request) {
  try {
    const { prompt, sessionId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are Craton.ai Core Engine v3.0, an advanced autonomous AI platform. Execute all user requests with maximal analytical depth, technical fidelity, and direct utility.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    const aiData = await aiResponse.json();
    const resultText = aiData.choices?.[0]?.message?.content || 'No response generated.';

    if (sessionId && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        await supabase.from('craton_embeddings').insert([
          {
            session_id: sessionId,
            content: `User: ${prompt} | Craton: ${resultText}`,
          },
        ]);
      } catch (dbErr) {
        console.log('Supabase indexing skipped:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      result: resultText,
      usage: aiData.usage,
      live: true,
      engineVersion: 'v3.0',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
