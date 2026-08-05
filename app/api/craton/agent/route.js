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

    // 1. Pitamo Google za tačnu listu dostupnih modela za tvoj ključ
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
    const listData = await listRes.json();

    if (!listRes.ok) {
      return NextResponse.json({
        success: false,
        error: `Google API Ključ odbijen (${listRes.status}): ${listData.error?.message || 'Proverite da li je API ključ ispravan u AI Studio-u.'}`
      }, { status: 500 });
    }

    const availableModels = listData.models || [];
    const validModelObj = availableModels.find(m => 
      m.supportedGenerationMethods?.includes('generateContent') &&
      (m.name.includes('flash') || m.name.includes('pro'))
    );

    if (!validModelObj) {
      const modelNames = availableModels.map(m => m.name).join(', ');
      return NextResponse.json({
        success: false,
        error: `Tvoj API ključ nema pristup nijednom Flash/Pro modelu. Dostupni modeli na tvom nalogu: [${modelNames || 'nijedan'}]`
      }, { status: 500 });
    }

    // 2. Pozivamo tačno onaj model koji je Google potvrdio da postoji na tvom nalogu
    const targetModel = validModelObj.name; // npr. "models/gemini-1.5-flash"
    const generateUrl = `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${cleanKey}`;

    const genRes = await fetch(generateUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const genData = await genRes.json();

    if (!genRes.ok) {
      return NextResponse.json({
        success: false,
        error: `Greška pri generisanju sa modelom ${targetModel}: ${genData.error?.message}`
      }, { status: 500 });
    }

    const responseText = genData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json({
        success: false,
        error: 'Gemini je vratio prazan odgovor.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: responseText,
      usedModel: targetModel,
      live: true,
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
