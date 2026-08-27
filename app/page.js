'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('en');
  const [selectedFeature, setSelectedFeature] = useState('general');
  const [response, setResponse] = useState('');
  const [usedModel, setUsedModel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFeatureClick = (featureKey, templateText) => {
    setSelectedFeature(featureKey);
    setPrompt(templateText);
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
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans flex flex-col justify-between">
      <div className="w-full max-w-7xl mx-auto space-y-6 flex-grow">
        
        {/* HEADER */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Craton.ai Autonomous Engine</h1>
            <p className="text-sm text-slate-400 mt-1">Professional Multi-Language Superagent Workspace</p>
          </div>
          
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div>
              <p className="text-xs text-slate-400 font-medium">Pro Monthly Subscription</p>
              <p className="text-lg font-bold text-blue-400">$9.99<span className="text-xs text-slate-500"> /mo</span></p>
            </div>
            <div className="flex flex-col gap-1">
              <a 
                href="https://www.paypal.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-md text-center block"
              >
                PayPal / Credit Cards
              </a>
              <span className="text-[10px] text-slate-500 text-center">Visa, Master, Amex, PayPal</span>
            </div>
          </div>
        </div>

        {/* CAPABILITIES */}
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Craton Capabilities & Services (Select a service):</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => handleFeatureClick('financial', 'Check current gold price (XAU/USD), market trends, and key economic indicators.')}
              className={`p-4 text-xs font-semibold rounded-xl border text-left transition flex flex-col justify-between ${selectedFeature === 'financial' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              <span className="text-sm font-bold text-white mb-1">📈 Financial Tracker</span>
              <span className="text-[11px] text-slate-400">Analysis of gold, stocks, crypto, and market indices in real time.</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeatureClick('copywriting', 'Write professional high-conversion marketing copy and optimized content for a global audience.')}
              className={`p-4 text-xs font-semibold rounded-xl border text-left transition flex flex-col justify-between ${selectedFeature === 'copywriting' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              <span className="text-sm font-bold text-white mb-1">✍️ Global Copywriting</span>
              <span className="text-[11px] text-slate-400">Creation of marketing campaigns, posts, emails, and sales copy.</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeatureClick('summarizer', 'Extract key points, structured data, and summary for the following text: ')}
              className={`p-4 text-xs font-semibold rounded-xl border text-left transition flex flex-col justify-between ${selectedFeature === 'summarizer' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              <span className="text-sm font-bold text-white mb-1">📄 Smart Summarizer</span>
              <span className="text-[11px] text-slate-400">Smart analysis, core extraction, and structured overview of long texts.</span>
            </button>

            <button
              type="button"
              onClick={() => handleFeatureClick('debugger', 'Analyze the following code or technical error, identify the cause, and propose a solution: ')}
              className={`p-4 text-xs font-semibold rounded-xl border text-left transition flex flex-col justify-between ${selectedFeature === 'debugger' ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
            >
              <span className="text-sm font-bold text-white mb-1">💻 Code & Tech Debugger</span>
              <span className="text-[11px] text-slate-400">Resolving code errors, code optimization, and technical support.</span>
            </button>
          </div>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Select Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
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
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Enter the service or task you require from Craton:</label>
            <textarea
              rows="6"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your request in detail or select one of the features above..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-y shadow-inner leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-slate-400">Active Mode: <strong className="text-blue-400 uppercase">{selectedFeature}</strong></span>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl text-sm transition disabled:opacity-50 shadow-xl cursor-pointer"
            >
              {loading ? 'Processing...' : 'Execute Superagent Task'}
            </button>
          </div>
        </form>

        {/* OUTPUT */}
        {(response || loading) && (
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Response Output</span>
              {usedModel && <span className="text-xs bg-blue-950 text-blue-400 border border-blue-900 px-3 py-1 rounded-md font-mono">Model: {usedModel}</span>}
            </div>
            <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap text-slate-200">
              {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-6">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  Craton Engine is processing your request across nodes...
                </div>
              ) : (
                response
              )}
            </div>
          </div>
        )}

      </div>

      <footer className="w-full max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-6 text-center text-xs text-slate-600">
        Craton.ai Autonomous Environment &copy; 2026
      </footer>
    </main>
  );
}
