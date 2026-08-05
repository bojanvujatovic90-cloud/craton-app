export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- BESPLATNA PRETRAGA INTERNETA (DuckDuckGo HTML) ---
async function searchInternet(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) return `Pretraga interneta nije uspela. Nastavljam sa internim znanjem.`;

    const htmlText = await response.text();
    const snippets = [];
    const regex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    let count = 0;

    while ((match = regex.exec(htmlText)) !== null && count < 5) {
      const cleanSnippet = match[1].replace(/<[^>]+>/g, '').trim();
      if (cleanSnippet) {
        snippets.push(cleanSnippet);
        count++;
      }
    }

    return snippets.length > 0 ? JSON.stringify(snippets) : 'Nema direktnih rezultata pretrage.';
  } catch (error) {
    return `Greška pri pretrazi: ${error.message}`;
  }
}

export async function POST(request) {
  try {
    const { prompt, sessionId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt/Goal is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY nije pronađen u Vercel Environment Variables. Dodajte ključ i uradite Redeploy.'
      }, { status: 500 });
    }

    // Pretraga interneta za svež kontekst ako upit to zahteva
    let searchContext = '';
    if (prompt.toLowerCase().includes('traži') || prompt.toLowerCase().includes('vest') || prompt.toLowerCase().includes('istraži')) {
      searchContext = await searchInternet(prompt);
    }

    // Inicijalizacija Google Gemini 1.5 Flash modela
    const genAI = new GoogleGenerativeAI(apiKey.trim());
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: `Ti si Craton.ai Autonomous Superagent Engine v3.2 pokretan Gemini tehnologijom.
Obraduj zahteve autonomno, analitički i pruži kompletna i precizna rešenja.
Odgovaraj na jeziku na kom ti je postavljen upit.`
    });

    const fullPrompt = searchContext 
      ? `Kontekst sa interneta: ${searchContext}\n\nKorisnički zahtev: ${prompt}` 
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    // Supabase evidencija (ako je podešena)
    if (sessionId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        await supabase.from('craton_embeddings').insert([
          { session_id: sessionId, content: `Goal: ${prompt} | Result: ${responseText}` },
        ]);
      } catch (dbErr) {
        console.log('Supabase indexing skipped:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      result: responseText,
      thoughtProcess: searchContext ? ['Pretraga interneta uspešno izvršena...', 'Gemini 1.5 Flash generiše odgovor...'] : ['Gemini 1.5 Flash obrađuje upit...'],
      engineVersion: 'v3.2-gemini-superagent',
      live: true,
    });

  } catch (error) {
    console.error("Gemini Agent Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
