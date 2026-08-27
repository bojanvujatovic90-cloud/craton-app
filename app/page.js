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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER & PRO ACCESS CARD */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Craton.ai v5.0 Ultimate Suite</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-white">Autonomous Superagent</h1>
          </div>

          {/* PayPal Pro Access Widget */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4 w-full md:w-auto justify-between">
            <div>
              <p className="text-xs text-slate-400">Pro Access Plan</p>
              <p className="text-lg font-bold text-emerald-400">$9.99<span className="text-xs text-slate-400">/mo</span></p>
            </div>
            {/* PayPal Button Container */}
            <div id="paypal-button-container">
              <a 
                href="https://www.paypal.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-md block text-center"
              >
                PayPal Checkout
              </a>
            </div>
          </div>
        </header>

        {/* CONTROLS BAR: Language & Core Functions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Language Selector */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-equal w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
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

          {/* Core Function Selection Grid */}
          <div className="md:col-span-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Core Agent Capabilities</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button 
                onClick={() => { setMode('financial'); setPrompt('Proveri trenutnu cenu zlata (XAU/USD) i ključne berzanske indekse.'); }}
                className={`p-2.5 text-xs font-medium rounded-lg border transition text-left ${mode === 'financial' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                📈 Financial Tracker
              </button>
              <button 
                onClick={() => { setMode('copywriting'); setPrompt('Napiši profesionalni marketinški tekst za lansiranje globalnog AI softvera.'); }}
                className={`p-2.5 text-xs font-medium rounded-lg border transition text-left ${mode === 'copywriting' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                ✍️ Copywriting
              </button>
              <button 
                onClick={() => { setMode('summarizer'); setPrompt('Analiziraj i napravi strukturirani sažetak ključnih tačaka za sledeći tekst: '); }}
                className={`p-2.5 text-xs font-medium rounded-lg border transition text-left ${mode === 'summarizer' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                📄 Summarizer
              </button>
              <button 
                onClick={() => { setMode('debugger'); setPrompt('Analiziraj sledeći API kod i pronađi potencijalne greške: '); }}
                className={`p-2.5 text-xs font-medium rounded-lg border transition text-left ${mode === 'debugger' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                💻 Code Debugger
              </button>
            </div>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <textarea
            rows="4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Unesite vaš zadatak, pitanje, kod ili tekst za analizu..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm leading-relaxed"
          ></textarea>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">Mode: <strong className="text-emerald-400 uppercase">{mode}</strong></span>
            <button
              onClick={() => handleExecute(mode)}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg disabled:opacity-50 text-sm flex items-center gap-2"
            >
              {loading ? 'Processing...' : 'Execute Superagent'}
            </button>
          </div>
        </div>

        {/* OUTPUT DISPLAY */}
        {(response || loading) && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Superagent Output</h3>
              {usedModel && <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-md">Active Model: {usedModel}</span>}
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-6">
                  <div className="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                  Craton v5.0 engine is synthesizing data across multiple nodes...
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
