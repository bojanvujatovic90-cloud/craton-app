export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, sessionId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Provera da li ključ uopšte postoji u Vercel varijablama
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY nije pronađen u Vercel Environment Variables. Proverite podešavanja i uradite Redeploy.'
      }, { status: 500 });
    }

    // Poziv ka OpenAI API-ju
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
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

    // Ako OpenAI vrati grešku (npr. pogrešan ključ, nema kredita, itd.)
    if (!aiResponse.ok || aiData.error) {
      const openAiError = aiData.error?.message || JSON.stringify(aiData);
      return NextResponse.json({
        success: false,
        error: `OpenAI API Error: ${openAiError}`
      }, { status: aiResponse.status || 500 });
    }

    const resultText = aiData.choices?.[0]?.message?.content || 'Odgovor je prazan.';

    // Skladištenje u Supabase ako su podešene varijable
    if (sessionId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
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
