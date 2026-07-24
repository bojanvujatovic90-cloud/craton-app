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
            content: 'You are Craton.ai, a fully autonomous, production-grade AI system. Execute tasks directly, precisely, and with highest technical fidelity.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    const aiData = await aiResponse.json();
    const resultText = aiData.choices?.[0]?.message?.content || 'No response generated.';

    if (sessionId && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await supabase.from('craton_embeddings').insert([
        {
          session_id: sessionId,
          content: `User: ${prompt} | Craton: ${resultText}`,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      result: resultText,
      usage: aiData.usage,
      live: true,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
