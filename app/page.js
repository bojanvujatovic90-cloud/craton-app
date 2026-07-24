'use client';

import { useState } from 'react';

export default function CratonDashboard() {
  const [lang, setLang] = useState('sr'); // 'sr' ili 'en'
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(
    lang === 'sr' ? 'SISTEM JE AKTIVAN — AUTONOMNI REŽIM' : 'SYSTEM ONLINE — FULL AUTONOMOUS MODE'
  );

  // Tekstovi za višejezičnost
  const t = {
    sr: {
      title: 'CRATON.AI',
      badge: 'PRODUKCIJA UŽIVO',
      statusLabel: 'STATUS SISTEMA:',
      inputPlaceholder: 'Napišite šta želite da Craton izvrši...',
      executeBtn: 'IZVRŠI',
      runningBtn: 'OBRADA...',
      idleText: '// Craton.ai sistem je spreman. Izaberite funkciju ispod ili unesite sopstveni zahtev...',
      functionsTitle: 'Brze Funkcije & Moduli:',
      features: [
        { label: '🧠 Autonomni Agent', prompt: 'Deluj kao autonomni AI agent i predloži kompletan plan optimizacije projekta.' },
        { label: '📊 Analiza Podataka', prompt: 'Izvrši detaljnu analizu ulaznih podataka i izvuci ključne uvide i statistiku.' },
        { label: '⚡ Automatizacija', prompt: 'Kreirajte automatski radni tok (workflow) za integraciju servisa i obradu podataka.' },
        { label: '🔍 Pretraga & Indeksiranje', prompt: 'Pretraži i indeksiraj ključne informacije u vektorskoj bazi memorije.' },
        { label: '🛡️ Sigurnost & Revizija', prompt: 'Izvrši sigurnosnu proveru i identifikuj potencijalne ranjivosti u sistemu.' },
        { label: '💡 Generisanje Ideja', prompt: 'Izgeneriši 5 inovativnih poslovnih i tehničkih rešenja na osnovu trendova.' },
      ],
    },
    en: {
      title: 'CRATON.AI',
      badge: 'LIVE PRODUCTION',
      statusLabel: 'SYSTEM STATUS:',
      inputPlaceholder: 'Type what you want Craton to execute...',
      executeBtn: 'EXECUTE',
      runningBtn: 'RUNNING...',
      idleText: '// Craton.ai system idle. Select a quick feature below or type your custom command...',
      functionsTitle: 'Quick Features & Modules:',
      features: [
        { label: '🧠 Autonomous Agent', prompt: 'Act as an autonomous AI agent and suggest a full project optimization plan.' },
        { label: '📊 Data Analytics', prompt: 'Perform a detailed analysis of input data and extract key insights and statistics.' },
        { label: '⚡ Automation Workflow', prompt: 'Create an automated workflow for service integration and data processing.' },
        { label: '🔍 Search & Indexing', prompt: 'Search and index key information within the vector memory database.' },
        { label: '🛡️ Security & Audit', prompt: 'Conduct a security audit and identify potential system vulnerabilities.' },
        { label: '💡 Idea Generation', prompt: 'Generate 5 innovative business and technical solutions based on current trends.' },
      ],
    },
  }[lang];

  const executeAutonomousTask = async (customPrompt) => {
    const textToRun = customPrompt || prompt;
    if (!textToRun.trim()) return;

    setLoading(true);
    setStatus(lang === 'sr' ? 'OBRADA ZAHTEVA PREKO LIVE ENGINE-A...' : 'EXECUTING TASK VIA LIVE ENGINE...');

    try {
      const res = await fetch('/api/craton/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToRun }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
        setStatus(lang === 'sr' ? 'ZADATAK USPEŠNO IZVRŠEN' : 'TASK COMPLETED & MEMORY INDEXED');
      } else {
        setOutput(`Execution Error: ${data.error}`);
        setStatus(lang === 'sr' ? 'GREŠKA PRI IZVRŠAVANJU' : 'EXECUTION FAILED');
      }
    } catch (err) {
      setOutput(`System Error: ${err.message}`);
      setStatus(lang === 'sr' ? 'KRITIČNA GREŠKA SISTEMA' : 'CRITICAL ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
      
      {/* Zaglavlje sa izborom jezika */}
      <header style={{ borderBottom: '1px solid #064e3b', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', itemsCenter: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
          <h1 style={{ fontSize: '20px', margin: 0, color: '#fff', letterSpacing: '2px' }}>{t.title}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Dugmad za jezik */}
          <div style={{ display: 'flex', border: '1px solid #064e3b', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              onClick={() => { setLang('sr'); setStatus('SISTEM JE AKTIVAN — AUTONOMNI REŽIM'); }}
              style={{
                backgroundColor: lang === 'sr' ? '#059669' : '#000',
                color: lang === 'sr' ? '#000' : '#10b981',
                border: 'none',
                padding: '4px 10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              SR
            </button>
            <button
              onClick={() => { setLang('en'); setStatus('SYSTEM ONLINE — FULL AUTONOMOUS MODE'); }}
              style={{
                backgroundColor: lang === 'en' ? '#059669' : '#000',
                color: lang === 'en' ? '#000' : '#10b981',
                border: 'none',
                padding: '4px 10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '12px'
              }}
            >
              EN
            </button>
          </div>

          <span style={{ fontSize: '12px', border: '1px solid #064e3b', padding: '4px 8px', borderRadius: '4px', color: '#10b981' }}>
            {t.badge}
          </span>
        </div>
      </header>

      {/* Glavni sadržaj */}
      <main style={{ margin: '24px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Traka za status */}
        <div style={{ backgroundColor: 'rgba(6, 78, 59, 0.2)', border: '1px solid #064e3b', padding: '12px', fontSize: '12px' }}>
          {t.statusLabel} <span style={{ color: '#fff', fontWeight: 'bold' }}>{status}</span>
        </div>

        {/* Dugmad za brze funkcije */}
        <div>
          <div style={{ fontSize: '13px', color: '#a1a1aa', marginBottom: '8px', fontWeight: 'bold' }}>
            {t.functionsTitle}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
            {t.features.map((feat, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrompt(feat.prompt);
                  executeAutonomousTask(feat.prompt);
                }}
                disabled={loading}
                style={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  color: '#e4e4e7',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#27272a')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#18181b')}
              >
                {feat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ekran sa izlaznim rezultatima */}
        <div style={{ flex: 1, backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', minHeight: '260px', fontSize: '14px', color: '#e4e4e7', overflowY: 'auto' }}>
          {output ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{output}</pre>
          ) : (
            <span style={{ color: '#52525b' }}>{t.idleText}</span>
          )}
        </div>

        {/* Polje za slobodan unos */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeAutonomousTask()}
            placeholder={t.inputPlaceholder}
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '12px', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={() => executeAutonomousTask()}
            disabled={loading}
            style={{ backgroundColor: '#059669', color: '#000', fontWeight: 'bold', border: 'none', padding: '0 24px', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? t.runningBtn : t.executeBtn}
          </button>
        </div>
      </main>

      {/* Podnožje */}
      <footer style={{ borderTop: '1px solid #18181b', paddingTop: '16px', fontSize: '12px', color: '#52525b', display: 'flex', justifyContent: 'space-between' }}>
        <span>Craton Engine v2.4</span>
        <span>Zero-Demo Architecture</span>
      </footer>
    </div>
  );
}
