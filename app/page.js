'use client';

import { useState } from 'react';

export default function CratonDashboard() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('SYSTEM ONLINE — FULL AUTONOMOUS MODE');

  const executeAutonomousTask = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStatus('EXECUTING TASK VIA LIVE ENGINE...');

    try {
      const res = await fetch('/api/craton/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.success) {
        setOutput(data.result);
        setStatus('TASK COMPLETED & MEMORY INDEXED');
      } else {
        setOutput(`Execution Error: ${data.error}`);
        setStatus('EXECUTION FAILED');
      }
    } catch (err) {
      setOutput(`System Error: ${err.message}`);
      setStatus('CRITICAL ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
      <header style={{ borderBottom: '1px solid #064e3b', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
          <h1 style={{ fontSize: '20px', margin: 0, color: '#fff', letterSpacing: '2px' }}>CRATON.AI</h1>
        </div>
        <span style={{ fontSize: '12px', border: '1px solid #064e3b', padding: '4px 8px', borderRadius: '4px' }}>
          LIVE PRODUCTION
        </span>
      </header>

      <main style={{ margin: '24px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ backgroundColor: 'rgba(6, 78, 59, 0.2)', border: '1px solid #064e3b', padding: '12px', fontSize: '12px' }}>
          STATUS: <span style={{ color: '#fff', fontWeight: 'bold' }}>{status}</span>
        </div>

        <div style={{ flex: 1, backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '16px', minHeight: '300px', fontSize: '14px', color: '#e4e4e7', overflowY: 'auto' }}>
          {output ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{output}</pre>
          ) : (
            <span style={{ color: '#52525b' }}>// Craton.ai system idle. Ready for autonomous execution...</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeAutonomousTask()}
            placeholder="Enter autonomous command or task..."
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff', padding: '12px', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={executeAutonomousTask}
            disabled={loading}
            style={{ backgroundColor: '#059669', color: '#000', fontWeight: 'bold', border: 'none', padding: '0 24px', borderRadius: '6px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'RUNNING...' : 'EXECUTE'}
          </button>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #18181b', paddingTop: '16px', fontSize: '12px', color: '#52525b', display: 'flex', justifyContent: 'space-between' }}>
        <span>Craton Engine v2.4</span>
        <span>Zero-Demo Architecture</span>
      </footer>
    </div>
  );
}
