'use client';

import { useState, useEffect } from 'react';

export default function CratonDashboard() {
  const [lang, setLang] = useState('sr'); // 'sr' ili 'en'
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState(
    lang === 'sr' ? 'SISTEM AKTIVAN — CORE ENGINE v3.0' : 'SYSTEM ONLINE — CORE ENGINE v3.0'
  );

  // Generiši jedinstveni ID sesije pri pokretanju
  useEffect(() => {
    setSessionId(`session-${Date.now()}`);
  }, []);

  const t = {
    sr: {
      title: 'CRATON.AI',
      version: 'v3.0 UPGRADED',
      badge: 'PRODUKCIJA UŽIVO',
      statusLabel: 'STATUS ENGINE-A:',
      inputPlaceholder: 'Unesite komandu, zadatak ili izaberite modul ispod...',
      executeBtn: 'IZVRŠI',
      runningBtn: 'OBRADA...',
      clearBtn: 'OČISTI',
      idleText: '// Craton Core v3.0 spreman za rad. Izaberite jedan od proširenih AI modula ili unesite sopstveni zahtev...',
      functionsTitle: 'Autonomni Moduli & Brze Funkcije:',
      features: [
        { label: '🧠 Autonomni Agent', prompt: 'Deluj kao autonomni AI agent i kreiraj kompletan operativni plan za projekat.' },
        { label: '💻 Generisanje Koda', prompt: 'Napiši čist, optimizovan i bezbedan kôd za zadatu funkcionalnost sa objasnjenjem.' },
        { label: '📊 Analiza Podataka', prompt: 'Izvrši detaljnu strukturnu analizu podataka i izvuci ključne uvide i metriku.' },
        { label: '⚡ Automatski Workflow', prompt: 'Dizajniraj automatski radni tok (workflow) za integraciju servisa i obradu podataka.' },
        { label: '🔍 Smart Search & Index', prompt: 'Analiziraj i indeksiraj ključne podatke unutar vektorske baze znanja.' },
        { label: '🛡️ Sigurnost & Revizija', prompt: 'Izvrši detekciju potencijalnih ranjivosti i ponudi sigurnosne preporuke.' },
        { label: '💡 Strategija & Ideje', prompt: 'Generiši 5 naprednih poslovno-tehnoloških strateških rešenja.' },
        { label: '📈 Finansijski Model', prompt: 'Razvij osnovni model prihoda i analizu strukture troškova za projekat.' },
      ],
    },
    en: {
      title: 'CRATON.AI',
      version: 'v3.0 UPGRADED',
      badge: 'LIVE PRODUCTION',
      statusLabel: 'ENGINE STATUS:',
      inputPlaceholder: 'Enter custom instruction or choose a module below...',
      executeBtn: 'EXECUTE',
      runningBtn: 'RUNNING...',
      clearBtn: 'CLEAR',
      idleText: '// Craton Core v3.0 ready. Select an upgraded module below or type your custom instruction...',
      functionsTitle: 'Autonomous Modules & Quick Actions:',
      features: [
        { label: '🧠 Autonomous Agent', prompt: 'Act as an autonomous AI agent and build a complete operational roadmap.' },
        { label: '💻 Code Generation', prompt: 'Write clean, optimized, and production-grade code for the specified requirement.' },
        { label: '📊 Data Analytics', prompt: 'Perform a deep-structure analysis of input data and extract actionable insights.' },
        { label: '⚡ Automated Workflow', prompt: 'Design an automated workflow integration for background data processing.' },
        { label: '🔍 Smart Search & Index', prompt: 'Process and index vector embeddings inside the active knowledge memory.' },
        { label: '🛡️ Security Audit', prompt: 'Conduct a thorough vulnerability assessment and issue mitigation strategy.' },
        { label: '💡 Strategy & Innovation', prompt: 'Generate 5 high-impact technology and business strategy models.' },
        { label: '📈 Financial Model', prompt: 'Develop a core revenue engine structure and unit economics framework.' },
      ],
    },
  }[lang];

  const executeAutonomousTask = async (customPrompt) => {
    const textToRun = customPrompt || prompt;
    if (!textToRun.trim()) return;

    setLoading(true);
    setStatus(lang === 'sr' ? 'OBRADA ZAHTEVA PREKO CRATON ENGINE-A...' : 'EXECUTING VIA CRATON ENGINE...');

    try {
      const res = await fetch('/api/craton/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToRun, sessionId }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
        setStatus(lang === 'sr' ? 'ZADATAK USPEŠNO IZVRŠEN & SAČUVAN' : 'TASK COMPLETED & INDEXED IN MEMORY');
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
    <div style={{ minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', backgroundColor: '#000', color: '#10b981', fontFamily: 'monospace' }}>
      
      {/* Zaglavlje */}
      <header style={{ borderBottom: '1px solid #064e3b', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
          <div>
            <h1 style={{ fontSize: '20px', margin: 0, color: '#fff', letterSpacing: '2px', fontWeight: 'bold' }}>{t.title}</h1>
            <span style={{ fontSize: '10px', color: '#059669', letterSpacing: '1px' }}>{t.version}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Biranje jezika */}
          <div style={{ display: 'flex', border: '1px solid #064e3b', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              onClick={() => { setLang('sr'); setStatus('SISTEM AKTIVAN — CORE ENGINE v3.0'); }}
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
              onClick={() => { setLang('en'); setStatus('SYSTEM ONLINE — CORE ENGINE v3.0'); }}
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

          <span style={{ fontSize: '11px', border: '1px solid #064e3b', padding: '4px 8px', borderRadius: '4px', color: '#10b981', backgroundColor: 'rgba(6,78,59,0.3)' }}>
            {t.badge}
          </span>
        </div>
      </header>

      {/* Glavni Sadržaj */}
      <main style={{ margin: '20px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Statusna traka */}
        <div style={{ backgroundColor: 'rgba(6, 78, 59, 0.2)', border: '1px solid #064e3b', padding: '10px 14px', fontSize: '12px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {t.statusLabel} <span style={{ color: '#fff', fontWeight: 'bold' }}>{status}</span>
          </div>
          {output && (
            <button
              onClick={() => { setOutput(''); setPrompt(''); }}
              style={{ backgroundColor: 'transparent', border: '1px solid #064e3b', color: '#059669', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', cursor: 'pointer' }}
            >
              {t.clearBtn}
            </button>
          )}
        </div>

        {/* Meni sa funkcijama */}
        <div>
          <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t.functionsTitle}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
            {t.features.map((feat, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrompt(feat.prompt);
                  executeAutonomousTask(feat.prompt);
                }}
                disabled={loading}
                style={{
                  backgroundColor: '#09090b',
                  border: '1px solid #27272a',
                  color: '#e4e4e7',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#18181b';
                  e.currentTarget.style.borderColor = '#059669';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#09090b';
                  e.currentTarget.style.borderColor = '#27272a';
                }}
              >
                {feat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output ekran za rezultate */}
        <div style={{ flex: 1, backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', minHeight: '280px', fontSize: '14px', color: '#e4e4e7', overflowY: 'auto', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)' }}>
          {output ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.5' }}>{output}</pre>
          ) : (
            <span style={{ color: '#52525b' }}>{t.idleText}</span>
          )}
        </div>

        {/* Polje za unos komande */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeAutonomousTask()}
            placeholder={t.inputPlaceholder}
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '12px 16px', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={() => executeAutonomousTask()}
            disabled={loading}
            style={{ backgroundColor: '#059669', color: '#000', fontWeight: 'bold', border: 'none', padding: '0 28px', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.5 : 1, transition: '0.2s' }}
          >
            {loading ? t.runningBtn : t.executeBtn}
          </button>
        </div>
      </main>

      {/* Podnožje */}
      <footer style={{ borderTop: '1px solid #18181b', paddingTop: '14px', fontSize: '11px', color: '#52525b', display: 'flex', justifyContent: 'space-between' }}>
        <span>Craton Engine v3.0 — Upgraded & Active</span>
        <span>Session: {sessionId || 'Initializing...'}</span>
      </footer>
    </div>
  );
}
