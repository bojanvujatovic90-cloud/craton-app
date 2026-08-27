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
    <main style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f2937', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>Craton.ai Autonomous Engine</h1>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0.25rem 0 0 0' }}>Multi-Language Superagent</p>
          </div>
          <a 
            href="https://www.paypal.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ backgroundColor: '#2563eb', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}
          >
            PayPal / Cards ($9.99/mo)
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f2937', marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#9ca3af', marginBottom: '0.5rem' }}>Select Language</label>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: '100%', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '8px', padding: '0.75rem', color: '#fff', fontSize: '0.9rem' }}
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#9ca3af', marginBottom: '0.5rem' }}>Prompt / Goal</label>
            <textarea
              rows="4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Unesite vaš zadatak..."
              style={{ width: '100%', backgroundColor: '#030712', border: '1px solid #374151', borderRadius: '8px', padding: '0.75rem', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}
          >
            {loading ? 'Processing...' : 'Execute'}
          </button>
        </form>

        {/* Output */}
        {(response || loading) && (
          <div style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1f2937', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>Response Output</span>
              {usedModel && <span style={{ fontSize: '0.75rem', backgroundColor: '#1e3a8a', color: '#93c5fd', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Model: {usedModel}</span>}
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
              {loading ? 'Generisanje odgovora...' : response}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
