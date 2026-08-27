'use client';

import { useState } from 'react';

export default function CratonDashboard() {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('general');
  const [language, setLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [usedModel, setUsedModel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecute = async (selectedMode = mode) => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    setUsedModel('');

    try {
      const res = await fetch('/api/craton/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode: selectedMode, language })
      });

      const data = await res.json();
      if (data.success) {
        setResponse(data.result);
        setUsedModel(data.usedModel);
      } else {
        setResponse(`Engine Error: ${data.error}`);
      }
    } catch (err) {
      setResponse(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* HEADER & PAYPAL PRO ACCESS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold">Craton.ai v5.1 Autonomous Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Superagent Suite</h1>
          </div>

          {/* PayPal Pro Subscription Card sa karticama */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-6 w-full md:w-auto">
            <div>
              <p className="text-xs text-slate-400 font-medium">Pro Monthly Access</p>
              <p className="text-lg font-extrabold text-blue-400">$9.99<span className="text-xs text-slate-500"> /mo</span></p>
            </div>
            <div className="flex flex-col gap-1.5">
              <a 
                href="https://www.paypal.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition shadow-md text-center"
              >
                PayPal / Cards
              </a>
              <span className="text-[10px] text-slate-500 text-center">Supports Visa, MC, PayPal</span>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: Language & Core Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Language Selector */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Select Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="en">English (EN)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="fr">Français (FR)</option>
              <option value="zh">中文 (ZH)</option>
              <option value="es">Español (ES)</option>
              <option value="ja">日本語 (JA)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="he">עברית (HE)</option>
            </select>
          </div>

          {/* Core Capabilities Selector */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Agent Capabilities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button 
                onClick={() => { setMode('financial'); setPrompt('Analiziraj trenutne berzanske trendove, cenu zlata i ključne finansijske indikatore.'); }}
                className={`p-3 text-xs font-semibold rounded-xl border transition text-center ${mode === 'financial' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
              >
                📈 Financial
              </button>
              <button 
                onClick={() => { setMode('copywriting'); setPrompt('Napiši profesionalni marketinški tekst visoke konverzije za lansiranje globalnog softvera.'); }}
                className={`p-3 text-xs font-semibold rounded-xl border transition text-center ${mode === 'copywriting' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
              >
                ✍️ Copywriting
              </button>
              <button 
                onClick={() => { setMode('summarizer'); setPrompt('Izvuci ključne tačke i napravi strukturirani sažetak za sledeći tekst: '); }}
                className={`p-3 text-xs font-semibold rounded-xl border transition text-center ${mode === 'summarizer' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
              >
                📄 Summarizer
              </button>
              <button 
                onClick={() => { setMode('debugger'); setPrompt('Analiziraj sledeći kod, identifikuj uzrok greške i predloži optimalno rešenje: '); }}
                className={`p-3 text-xs font-semibold rounded-xl border transition text-center ${mode === 'debugger' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
              >
                💻 Debugger
              </button>
            </div>
          </div>
        </div>

        {/* PROMPT INPUT SECTION */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <textarea
            rows="5"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Unesite vaš zadatak, pitanje, kod ili tekst za obradu..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm leading-relaxed transition"
          ></textarea>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-slate-400">Active Mode: <strong className="text-blue-400 uppercase tracking-wide">{mode}</strong></span>
            <button
              onClick={() => handleExecute(mode)}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition shadow-lg disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Execute Superagent'}
            </button>
          </div>
        </div>

        {/* OUTPUT DISPLAY SECTION */}
        {(response || loading) && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Superagent Response Output</h3>
              {usedModel && <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800/60 px-3 py-1 rounded-lg font-mono">Model: {usedModel}</span>}
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-6 justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  Craton v5.1 is synthesizing data across nodes...
                </div>
              ) : (
                response
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
