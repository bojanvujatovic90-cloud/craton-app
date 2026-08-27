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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center shadow-lg">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white m-0">Craton.ai Autonomous Engine</h1>
            <p className="text-xs text-slate-400 mt-1">Multi-Language Superagent</p>
          </div>
          <a 
            href="https://www.paypal.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition"
          >
            PayPal / Cards ($9.99/mo)
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Select Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
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
            <label className="block text-xs font-semibold text-slate-400 mb-2">Prompt / Goal</label>
            <textarea
              rows="4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Unesite vaš zadatak..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Execute'}
          </button>
        </form>

        {/* Output */}
        {(response || loading) && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Response Output</span>
              {usedModel && <span className="text-xs bg-blue-950 text-blue-400 border border-blue-900 px-2.5 py-1 rounded">Model: {usedModel}</span>}
            </div>
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
              {loading ? 'Generisanje odgovora...' : response}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
