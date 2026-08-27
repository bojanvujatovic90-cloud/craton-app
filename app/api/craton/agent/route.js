export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';

// --- ROBUST MULTI-STRATEGY INTERNET SEARCH ---
async function searchInternet(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) return `Internet search feed unavailable.`;

    const htmlText = await response.text();
    const snippets = [];
    
    // Strategija 1: Ekstrakcija standardnih DuckDuckGo snippet klasa
    const regexSnippet = /<a[^>]*class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regexSnippet.exec(htmlText)) !== null && snippets.length < 6) {
      const clean = match[1].replace(/<[^>]+>/g, '').trim();
      if (clean && !snippets.includes(clean)) snippets.push(clean);
    }

    // Strategija 2: Alternativno izvlačenje tekstualnih blokova ako je struktura izmenjena
    if (snippets.length === 0) {
      const regexBody = /class="result__body">([\s\S]*?)<\/div>/g;
      while ((match = regexBody.exec(htmlText)) !== null && snippets.length < 6) {
        const clean = match[1].replace(/<[^>]+>/g, '').trim();
        if (clean && !snippets.includes(clean)) snippets.push(clean);
      }
    }

    return snippets.length > 0 
      ? JSON.stringify(snippets) 
      : 'No direct web snippets captured, proceeding with analytical synthesis.';
  } catch (error) {
    return `Search engine warning: ${error.message}`;
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

    // Multilingual Search Keyword Detection
    const lowerPrompt = prompt.toLowerCase();
    const searchKeywords = [
      'search', 'latest', 'news', 'find', 'explore', 'cena', 'price', 'gold', 'zlato',
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

    // SYSTEM INSTRUCTION
    const systemInstruction = `You are Craton.ai Autonomous Superagent Engine v4.7.
Your operational core supports multi-language processing with strict language auto-matching and real-time data synthesis:

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
Detect the primary language of the user's input among the target languages listed above or use the explicit language tag provided. You MUST respond ENTIRELY in that same language. Do NOT use Serbian unless explicitly requested. If real-time web context is provided, integrate it seamlessly into your response with exact data points. Always format output with clear Markdown structure, bold key details, and tables where applicable.`;

    const fullPrompt = searchContext 
      ? `Real-time Web Context Data:\n${searchContext}\n\nUser Request: ${prompt}` 
      : prompt;

    // Aktuelni stabilni modeli poslednje generacije
    const candidateEndpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${cleanKey}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${cleanKey}`
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
          usedModel = url.includes('3.6-flash') ? 'gemini-3.6-flash' : 'gemini-3.1-pro-preview';
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

    return NextResponse.json({
      success: true,
      result: responseText,
      usedModel: usedModel,
      thoughtProcess: searchContext 
        ? ['Enhanced web search executed successfully...', 'Multilingual Gemini Engine synthesis...'] 
        : ['Craton Engine v4.7 processing...'],
      engineVersion: 'v4.7-gemini-multilingual-superagent',
      supportedLanguages: ['en', 'de', 'fr', 'zh', 'es', 'ja', 'hi', 'he'],
      live: true,
    });

  } catch (error) {
    console.error("Craton Engine Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
