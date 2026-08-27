'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [response, setResponse] = useState('');
  const [usedModel, setUsedModel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse('');
    setUsedModel('');

    try {
      const res = await fetch('/api/craton/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResponse(data.result);
        setUsedModel(data.usedModel);
      } else {
        setResponse(data.error || 'Unknown error occurred.');
      }
    } catch (err) {
      setResponse('Failed to connect to Craton Engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans flex flex-col justify-between">
      <div className="w-full max-w-5xl mx-auto space-y-8 flex-grow">
        
        {/* Header sa PayPal dugmetom */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white m-0 tracking-tight">Craton.ai Autonomous Engine</h1>
            <p className="text-xs text-slate-400 mt-1">Multi-Language Superagent Workspace</p>
          </div>
          <a 
            href="https://www.paypal.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-md"
          >
            PayPal / Cards ($9.99/mo)
          </a>
        </div>

        {/* Glavna forma preko celog ekrana */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Select Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
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

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Prompt / Usluga</label>
            <textarea
              rows="6"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Unesite vaš zadatak..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-base text-slate-200 focus:outline-none focus:border-blue-500 resize-y leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition disabled:opacity-50 shadow-lg cursor-pointer"
            >
              {loading ? 'Processing...' : 'Execute'}
            </button>
          </div>
        </form>

        {/* Output sekcija */}
        {(response || loading) && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Response Output</span>
              {usedModel && <span className="text-xs bg-blue-950 text-blue-400 border border-blue-900 px-3 py-1 rounded-md font-mono">Model: {usedModel}</span>}
            </div>
            <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap text-slate-200">
              {loading ? 'Generisanje odgovora...' : response}
            </div>
          </div>
        )}

      </div>

      <footer className="w-full max-w-5xl mx-auto border-t border-slate-900 mt-12 pt-6 text-center text-xs text-slate-600">
        Craton.ai Autonomous Environment &copy; 2026
      </footer>
    </main>
  );
}
