"use client";

import { useState, useRef, useEffect } from "react";

// Definisane funkcije koje Craton obavlja
const CRATON_FUNCTIONS = [
  {
    id: "strategy",
    title: "Autonomous Strategy & Planning",
    description: "Analyze complex goals, break them down into multi-step execution plans.",
    promptTemplate: "Create a detailed execution strategy for: "
  },
  {
    id: "multilingual",
    title: "Global Multilingual Processing",
    description: "Translate, analyze, and generate professional output across 8 target languages.",
    promptTemplate: "Analyze and translate the following concepts professionally: "
  },
  {
    id: "websearch",
    title: "Real-time Web Intelligence",
    description: "Perform live searches and retrieve up-to-date data, news, and market insights.",
    promptTemplate: "Search the latest news and updates regarding: "
  },
  {
    id: "code",
    title: "Technical & System Architecture",
    description: "Design modular software architectures, API routes, and debug code seamlessly.",
    promptTemplate: "Provide technical architecture and production code for: "
  },
  {
    id: "finance",
    title: "Financial & Market Analysis",
    description: "Evaluate macroeconomic trends, investment strategies, and trade structures.",
    promptTemplate: "Provide a structured financial and risk analysis for: "
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
      content: "Welcome to Craton.ai Autonomous Superagent Engine v4.1. Select a function from the grid below or type your custom goal.",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [usedModel, setUsedModel] = useState(null);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
          <div style={styles.badge}>v4.1 Ultra Engine</div>
          
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
        <p style={styles.subtitle}>Autonomous Intelligence & Multi-Function Engine</p>
      </header>

      {/* Function Menu Grid */}
      <div style={styles.functionGridContainer}>
        <div style={styles.gridTitle}>Available Core Functions:</div>
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
            placeholder="Select a function above or type your prompt..."
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
    padding: "16px 20px",
    borderBottom: "1px solid #334155",
    backgroundColor: "#1e293b",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
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
    fontSize: "13px",
    color: "#94a3b8",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #475569",
    backgroundColor: "#0f172a",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },
  title: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "700",
  },
  subtitle: {
    margin: "2px 0 0 0",
    fontSize: "13px",
    color: "#94a3b8",
  },
  functionGridContainer: {
    padding: "12px 20px",
    backgroundColor: "#111827",
    borderBottom: "1px solid #334155",
  },
  gridTitle: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    color: "#94a3b8",
    marginBottom: "8px",
  },
  functionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "8px",
  },
  functionCard: {
    padding: "10px 12px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#38bdf8",
    marginBottom: "4px",
  },
  cardDesc: {
    fontSize: "11px",
    color: "#94a3b8",
    lineHeight: "1.3",
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
