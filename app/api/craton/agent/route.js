export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, sessionId } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY nije pronađen u Vercel Environment Variables.'
      }, { status: 500 });
    }

    const cleanKey = apiKey.trim();

    // Provereni, aktivni modeli po prioritetu (izbačeni zastareli/deprecated modeli)
    const activeModels = [
      'models/gemini-2.5-flash-001',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro',
      'models/gemini-2.0-flash-exp'
    ];

    let responseText = null;
    let usedModelName = null;
    let lastError = null;

    for (const modelName of activeModels) {
      try {
        const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${cleanKey}`;
        
        const genRes = await fetch(generateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        const genData = await genRes.json();

        if (genRes.ok && genData.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseText = genData.candidates[0].content.parts[0].text;
          usedModelName = modelName;
          break; // Uspeh, izlazimo iz petlje
        } else {
          lastError = genData.error?.message || `HTTP ${genRes.status}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!responseText) {
      return NextResponse.json({
        success: false,
        error: `Nijedan model nije uspeo. Poslednja greška: ${lastError}`
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: responseText,
      usedModel: usedModelName,
      live: true,
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
