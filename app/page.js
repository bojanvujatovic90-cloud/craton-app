'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedFeature, setSelectedFeature] = useState('general');
  const [response, setResponse] = useState('');
  const [usedModel, setUsedModel] = useState('');
  const [loading, setLoading] = useState(false);

  // Funkcija za brzo postavljanje šablona na klik
  const handleFeatureSelect = (featureKey, defaultText) => {
    setSelectedFeature(featureKey);
    setPrompt(defaultText);
  };

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
        body: JSON.stringify({ prompt, language, mode: selectedFeature }),
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
        
        {/* Header sa PayPal-om i Karticama */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white m-0 text-center sm:text-left">Craton.ai Autonomous Engine</h1>
            <p className="text-xs text-slate-400 mt-1 text-center sm:text-left">Multi-Language Superagent</p>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <a 
              href="https://www.paypal.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition text-center shadow-md"
            >
              PayPal / Credit Cards ($9.99/mo)
            </a>
            <span className="text-[10px] text-slate-500">Supports Visa, Master, Amex, PayPal</span>
          </div>
        </div>

        {/* Sekcija sa ponudom funkcija (Šta Craton obavlja) */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg space-y-3">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Craton Capabilities (Izaberi funkciju):</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFeatureSelect('financial', 'Proveri trenutnu cenu zlata (XAU/USD) i ključne berzanske indekse.')}
              className={`p-2.5 text-xs font-medium rounded-lg border text-left transition ${selectedFeature === 'financial' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              📈 Financial Tracker & Live Prices
            </button>
            <button
              type="button"
              onClick={() => handleFeatureSelect('copywriting', 'Napiši profesionalni marketinški tekst visoke konverzije za lansiranje softvera.')}
              className={`p-2.5 text-xs font-medium rounded-lg border text-left transition ${selectedFeature === 'copywriting' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              ✍️ Global Copywriting & Content
            </button>
            <button
              type="button"
              onClick={() => handleFeatureSelect('summarizer', 'Izvuci ključne tačke i napravi strukturirani sažetak za sledeći tekst: ')}
              className={`p-2.5 text-xs font-medium rounded-lg border text-left transition ${selectedFeature === 'summarizer' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              📄 Smart Document Summarizer
            </button>
            <button
              type="button"
              onClick={() => handleFeatureSelect('debugger', 'Analiziraj sledeći kod ili API grešku i predloži rešenje: ')}
              className={`p-2.5 text-xs font-medium rounded-lg border text-left transition ${selectedFeature === 'debugger' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              💻 Code & Tech Debugger
            </button>
          </div>
        </div>

        {/* Glavna forma */}
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
              placeholder="Unesite vaš zadatak ili izaberite funkciju iznad..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-sm transition disabled:opacity-50 shadow-md"
          >
            {loading ? 'Processing...' : 'Execute Superagent'}
          </button>
        </form>

        {/* Output sekcija */}
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
