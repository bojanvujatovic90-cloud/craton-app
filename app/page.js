"use client";

import { useState, useRef, useEffect } from "react";

const CRATON_FUNCTIONS = [
  {
    id: "finance",
    title: "📈 Financial & Crypto Live Tracker",
    description: "Praćenje berze, zlata i kriptovaluta u realnom vremenu.",
    promptTemplate: "Check current gold price (XAU/USD), market trends, crypto prices, and key economic indicators for: "
  },
  {
    id: "copywriting",
    title: "✍️ Multi-Language Content & Copywriting",
    description: "Globalni generator marketinških i poslovnih tekstova.",
    promptTemplate: "Write professional high-conversion marketing copy and optimized content for a global audience regarding: "
  },
  {
    id: "summarizer",
    title: "📄 Smart Document & Data Summarizer",
    description: "Pametna analiza i strukturirano sažimanje teksta.",
    promptTemplate: "Extract key points, structured data, and summary for the following text: "
  },
  {
    id: "debugger",
    title: "💻 Code & Tech Debugger",
    description: "Asistent za rešavanje programskih grešaka i optimizaciju.",
    promptTemplate: "Analyze the following code or technical error, identify the cause, and propose a solution: "
  }
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "hi", label: "हिन्दी" },
  { code: "he", label: "עברית" }
];

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to Craton.ai Autonomous Superagent Engine v4.2. Select a core function above, choose your language, or complete payment via PayPal.",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Dinamičko učitavanje PayPal SDK skripte i renderovanje dugmeta
  useEffect(() => {
    if (document.getElementById("paypal-sdk")) return;

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = "https://www.paypal.com/sdk/js?client-id=AaNOLlsQaRtnD8oorI8_MNv0FAj7_WHWgEg9R8uJBIjTXFt0kT9SLDiDrArF5ElsDAsmJs7RVR3XxU9f&currency=USD";
    script.async = true;

    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '9.99',
                },
              }],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              setPaymentStatus(`Uspešna uplata! Hvala, ${details.payer.name.given_name}. Pristup je omogućen.`);
            });
          },
          onError: (err) => {
            setPaymentStatus("Greška prilikom uplate. Pokušajte ponovo.");
          }
        }).render('#paypal-button-container');
      }
    };

    document.body.appendChild(script);
  }, []);

  const handleFunctionClick = (func) => {
    setInput(func.promptTemplate);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = `[Language: ${selectedLang.toUpperCase()}] ${input.trim()}`;
    const displayQuery = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: displayQuery }]);
    setLoading(true);

    try {
      const response = await fetch("/api/craton/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userQuery,
          sessionId: "craton-session-v4",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.result },
        ]);
        if (data.usedModel) {
          setUsedModel(data.usedModel);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Engine Error: ${data.error || "Failed to process request."}`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Network Connection Error: ${err.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.topBar}>
          <div style={styles.badge}>v4.2 Ultra Engine + PayPal</div>
          
          {/* Language Selector */}
          <div style={styles.langSelectorWrapper}>
            <label style={styles.langLabel}>Language:</label>
            <select 
              value={selectedLang} 
              onChange={(e) => setSelectedLang(e.target.value)}
              style={styles.select}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h1 style={styles.title}>Craton.AI Superagent</h1>
        <p style={styles.subtitle}>Autonomous Intelligence & Secure PayPal Monetization</p>
      </header>

      {/* Main Layout Grid (Functions & Billing) */}
      <div style={styles.mainLayout}>
        {/* Function Menu Grid */}
        <div style={styles.functionSection}>
          <div style={styles.sectionTitle}>Available Core Functions:</div>
          <div style={styles.functionGrid}>
            {CRATON_FUNCTIONS.map((func) => (
              <div 
                key={func.id} 
                style={styles.functionCard}
                onClick={() => handleFunctionClick(func)}
              >
                <div style={styles.cardTitle}>{func.title}</div>
                <div style={styles.cardDesc}>{func.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PayPal Billing Box */}
        <div style={styles.billingCard}>
          <div style={styles.sectionTitle}>Pro Access ($9.99/mo)</div>
          <p style={styles.billingDesc}>Pay securely via PayPal to unlock full superagent processing.</p>
          <div id="paypal-button-container"></div>
          {paymentStatus && <div style={styles.paymentStatus}>{paymentStatus}</div>}
        </div>
      </div>

      {/* Chat Window */}
      <main style={styles.chatWindow}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.role === "user" ? "#2563eb" : "#1e293b",
                color: "#ffffff",
              }}
            >
              <div style={styles.roleLabel}>
                {msg.role === "user" ? "You" : "Craton Superagent"}
              </div>
              <div style={styles.messageContent}>{msg.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.messageWrapper, justifyContent: "flex-start" }}>
            <div style={{ ...styles.messageBubble, backgroundColor: "#1e293b" }}>
              <div style={styles.roleLabel}>Craton Engine</div>
              <div style={styles.loadingText}>Processing intelligence...</div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Footer / Input */}
      <footer style={styles.footer}>
        {usedModel && (
          <div style={styles.modelStatus}>
            Active Model: <strong>{usedModel}</strong>
          </div>
        )}
        <form onSubmit={handleSend} style={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Select a function above, choose language, or type your prompt..."
            style={styles.input}
            disabled={loading}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Thinking..." : "Execute"}
          </button>
        </form>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    padding: "14px 20px",
    borderBottom: "1px solid #334155",
    backgroundColor: "#1e293b",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  badge: {
    padding: "4px 10px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "bold",
  },
  langSelectorWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  langLabel: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  select: {
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "#fff",
    fontSize: "12px",
    outline: "none",
    cursor: "pointer",
  },
  title: {
    margin: "0",
    fontSize: "20px",
    fontWeight: "700",
  },
  subtitle: {
    margin: "2px 0 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: "12px",
    padding: "12px 20px",
    backgroundColor: "#111827",
    borderBottom: "1px solid #334155",
  },
  functionSection: {
    display: "flex",
    flexDirection: "column",
  },
  sectionTitle: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#94a3b8",
    marginBottom: "6px",
  },
  functionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "6px",
  },
  functionCard: {
    padding: "8px 10px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cardTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#38bdf8",
    marginBottom: "2px",
  },
  cardDesc: {
    fontSize: "10px",
    color: "#94a3b8",
    lineHeight: "1.2",
  },
  billingCard: {
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "6px",
    padding: "10px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  billingDesc: {
    fontSize: "11px",
    color: "#94a3b8",
    margin: "4px 0 8px 0",
  },
  paymentStatus: {
    marginTop: "6px",
    fontSize: "11px",
    color: "#34d399",
  },
  chatWindow: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: "12px 16px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  roleLabel: {
    fontSize: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#94a3b8",
    marginBottom: "4px",
  },
  messageContent: {
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },
  loadingText: {
    fontSize: "13px",
    color: "#38bdf8",
    fontStyle: "italic",
  },
  footer: {
    padding: "12px 20px",
    borderTop: "1px solid #334155",
    backgroundColor: "#1e293b",
  },
  modelStatus: {
    fontSize: "11px",
    color: "#64748b",
    marginBottom: "6px",
    textAlign: "right",
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};
