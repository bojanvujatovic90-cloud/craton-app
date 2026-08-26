export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';

// --- MULTI-LANGUAGE INTERNET SEARCH ENGINE (DuckDuckGo HTML) ---
async function searchInternet(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'de,fr,zh,es,ja,hi,he,en;q=0.9'
      }
    });

    if (!response.ok) return `Internet search unavailable. Relying on internal knowledge base.`;

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

    return snippets.length > 0 ? JSON.stringify(snippets) : 'No direct search results found.';
  } catch (error) {
    return `Search system notice: ${error.message}`;
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
        error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables. Please set the key and redeploy.'
      }, { status: 500 });
    }

    const cleanKey = apiKey.trim();

    // Multilingual Search Keyword Detection (English + DE, FR, ES, ZH, JA, HI, HE)
    const lowerPrompt = prompt.toLowerCase();
    const searchKeywords = [
      'search', 'latest', 'news', 'find', 'explore',
      'suche', 'nachrichten', 'aktuell',
      'recherche', 'nouvelles', 'actualité',
      'buscar', 'noticias', 'actualidad',
      '搜索', '新闻', '最新',
      '検索', 'ニュース', '最新',
      'खोज', 'समाचार', 'नवीनतम',
      'חפש', 'חדשות', 'עדכני'
    ];

    const needsSearch = searchKeywords.some(kw => lowerPrompt.includes(kw));
    let searchContext = '';
    
    if (needsSearch) {
      searchContext = await searchInternet(prompt);
    }

    // SYSTEM INSTRUCTION (German, French, Chinese, Spanish, Japanese, Hindi, Hebrew + English)
    const systemInstruction = `You are Craton.ai Autonomous Superagent Engine v4.0 Ultra.
Your operational core supports multi-language processing with strict language auto-matching:

TARGET LANGUAGES & BEHAVIOR:
1. English: Provide clear, authoritative, highly structured, and technical solutions.
2. German (Deutsch): Provide direct, precise, structure-driven, and highly professional responses.
3. French (Français): Provide articulate, elegant, clear, and comprehensive responses.
4. Chinese (中文 - Standard Mandarin): Provide logical, dense, well-structured, and accurate technical responses.
5. Spanish (Español): Provide dynamic, structured, engaging, and thorough answers.
6. Japanese (日本語): Provide polite (Desu/Masu), precise, clear, and structured explanations.
7. Hindi (हिन्दी): Provide clear, culturally accurate, structured, and helpful responses in Devanagari script.
8. Hebrew (עברית): Provide direct, concise, well-formatted responses (RTL friendly).

CRITICAL RULE:
Detect the primary language of the user's input among the target languages listed above. You MUST respond ENTIRELY in that same language. Do NOT use Serbian under any circumstances. Always format output with clear Markdown structure, bold key details, and tables where applicable.`;

    const fullPrompt = searchContext 
      ? `Real-time Web Context: ${searchContext}\n\nUser Request: ${prompt}` 
      : prompt;

    // Direct REST endpoints fallback
    const candidateEndpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${cleanKey}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${cleanKey}`
    ];

    let responseText = null;
    let usedModel = null;
    let lastError = null;

    for (const url of candidateEndpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: systemInstruction }]
            },
            contents: [
              {
                parts: [{ text: fullPrompt }]
              }
            ]
          })
        });

        const data = await res.json();

        if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseText = data.candidates[0].content.parts[0].text;
          usedModel = url.includes('gemini-1.5-pro') ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
          break;
        } else {
          lastError = data.error?.message || `HTTP ${res.status}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!responseText) {
      throw new Error(`Google Gemini Engine error: ${lastError}`);
    }

    // Supabase Embeddings Logging
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
        console.log('Supabase indexing notice:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      result: responseText,
      usedModel: usedModel,
      thoughtProcess: searchContext 
        ? ['Web search executed successfully...', 'Multilingual Gemini Engine processing...'] 
        : ['Craton Engine v4.0 processing...'],
      engineVersion: 'v4.0-gemini-multilingual-superagent',
      supportedLanguages: ['en', 'de', 'fr', 'zh', 'es', 'ja', 'hi', 'he'],
      live: true,
    });

  } catch (error) {
    console.error("Craton Engine Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
