'use client';

import { useState } from 'react';

export default function CratonDashboard() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [usedModel, setUsedModel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecute = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    setUsedModel('');

    try {
      const res = await fetch('/api/craton/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language })
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* HEADER & PAYPAL */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">Craton.ai Autonomous Superagent</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Engine Dashboard</h1>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-400">Pro Access</p>
              <p className="text-sm font-bold text-blue-400">$9.99<span className="text-xs text-slate-500">/mo</span></p>
            </div>
            <a 
              href="https://www.paypal.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-md"
            >
              PayPal / Cards
            </a>
          </div>
        </div>

        {/* LANGUAGE SELECTOR & STATUS BAR */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
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

          <div className="text-xs text-slate-400 text-center sm:text-right">
            Status: <span className="text-emerald-400 font-medium">Online & Ready</span>
          </div>
        </div>

        {/* INPUT SECTION */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <textarea
            rows="4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Unesite vaš zadatak ili pitanje..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm leading-relaxed"
          ></textarea>
          
          <div className="flex justify-end">
            <button
              onClick={handleExecute}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-lg disabled:opacity-50 text-sm"
            >
              {loading ? 'Processing...' : 'Execute'}
            </button>
          </div>
        </div>

        {/* OUTPUT SECTION */}
        {(response || loading) && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Response Output</h3>
              {usedModel && <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800 px-2.5 py-1 rounded-md font-mono">Model: {usedModel}</span>}
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
              {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-4">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  Processing request...
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
