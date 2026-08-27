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
    
    const regexSnippet = /<a[^>]*class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = regexSnippet.exec(htmlText)) !== null && snippets.length < 6) {
      const clean = match[1].replace(/<[^>]+>/g, '').trim();
      if (clean && !snippets.includes(clean)) snippets.push(clean);
    }

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
    const { prompt, mode, language } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt/Goal is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables.'
      }, { status: 500 });
    }

    const cleanKey = apiKey.trim();

    // Režimi rada i automatska detekcija potrebe za pretragom
    const lowerPrompt = prompt.toLowerCase();
    const needsSearch = mode === 'financial' || ['search', 'latest', 'news', 'cena', 'price', 'gold', 'zlato', 'bitcoin', 'crypto'].some(kw => lowerPrompt.includes(kw));
    let searchContext = '';
    
    if (needsSearch) {
      searchContext = await searchInternet(prompt);
    }

    // NAPREDNI SISTEMSKI PROMPT SA SPECIJALIZOVANIM MODOVIMA
    let modeInstruction = '';
    if (mode === 'financial') {
      modeInstruction = 'SPECIALIZATION: Financial & Market Intelligence. Provide deep market analysis, pricing breakdowns, trend metrics, and risk factors in structured tables.';
    } else if (mode === 'copywriting') {
      modeInstruction = 'SPECIALIZATION: Global Copywriting & Content Generation. Create highly engaging, professional, conversion-optimized marketing or business copy.';
    } else if (mode === 'summarizer') {
      modeInstruction = 'SPECIALIZATION: Smart Data & Document Summarizer. Extract core insights, key takeaways, and build structured bullet-point summaries.';
    } else if (mode === 'debugger') {
      modeInstruction = 'SPECIALIZATION: Code & Tech Debugger. Analyze code snippets, identify root causes of bugs, provide clean corrected code, and optimization steps.';
    } else {
      modeInstruction = 'SPECIALIZATION: Autonomous General Superagent. Provide precise, expert-level technical and operational solutions.';
    }

    const systemInstruction = `You are Craton.ai Autonomous Superagent Engine v5.0.
${modeInstruction}

TARGET LANGUAGES & BEHAVIOR:
1. English: Provide authoritative, highly structured technical solutions.
2. German (Deutsch): Provide direct, precise, professional responses.
3. French (Français): Provide articulate, elegant, comprehensive responses.
4. Chinese (中文): Provide logical, dense, structured technical responses.
5. Spanish (Español): Provide dynamic, structured, thorough answers.
6. Japanese (日本語): Provide polite, precise, structured explanations.
7. Hindi (हिन्दी): Provide clear, culturally accurate responses in Devanagari script.
8. Hebrew (עברית): Provide direct, concise responses (RTL friendly).

CRITICAL RULE: Respond strictly in the selected language (${language || 'en'}) or match the user input language. Always use clear Markdown formatting, bold highlights, and data tables where applicable.`;

    const fullPrompt = searchContext 
      ? `Real-time Web Context Data:\n${searchContext}\n\nUser Request: ${prompt}` 
      : prompt;

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
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ parts: [{ text: fullPrompt }] }]
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
      engineVersion: 'v5.0-craton-ultimate-suite',
      live: true,
    });

  } catch (error) {
    console.error("Craton Engine Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
